# UCMP pitfalls

Unequal-cost load balancing fails in production for predictable reasons. Memorize these failure modes.

## FC blocks paths people expect

Engineers set `variance 10` on dual unequal links and wonder why the backup never installs. The backup’s **RD ≥ FD** → not an FS → variance irrelevant. Fix metrics/topology so RD &lt; FD, or accept single-path until failure triggers Active.

## Slow link gets traffic

High variance pulls a high-metric FS into CEF sharing. A 1G primary and 10M backup with variance large enough will send real flows onto 10M—congesting the backup and hurting apps. Prefer `traffic-share min` or keep variance 1 if the backup is emergency-only.

## CEF / flow polarity

Even with balanced shares, **per-flow** CEF means two elephant flows can both hash to the worse path. UCMP is not packet-spraying. Lab with many flows before declaring success.

## maximum-paths truncation

Eligible UCMP set larger than `maximum-paths` → silent omission of some FS paths. Check both knobs.

## Metric lying

Manipulating `delay` to force FC/variance outcomes desynchronizes capacity reality. Document every delay hack; prefer structural dual equal paths when ECMP is the goal.

## Redistributed paths

External EIGRP routes (AD 170) may UCMP among themselves but interact differently with internals; mixing assumptions causes “why isn’t this in the table” confusion. Separate AD/policy clearly.

## “Backup is in topology but not in RIB”

Usually one of:

1. Fails FC (not FS).
2. Outside variance window.
3. Truncated by `maximum-paths`.
4. Beaten by another protocol’s AD.
5. Present but `traffic-share min` sends no traffic there (still installed).

Walk the five in order before changing delay.

## Verification checklist

```text
show ip eigrp topology <prefix>    ! RD, FD, FS?
show ip route <prefix>             ! which via installed?
show ip cef <prefix> detail        ! share counts
show ip protocols                  ! variance, maximum-paths, traffic-share
```

## Safe production defaults

| Goal | Setting |
|---|---|
| ECMP only on equal links | `variance 1`, truthful bw/delay |
| Hot standby, no share | small variance only if FC passes + `traffic-share min`, or rely on FS without install |
| True UCMP | modest variance, prove FC, watch CEF shares under load |

## Interview framing

“Three gotchas: FC veto, variance oversharing onto slow links, CEF flow imbalance. Debug with topology inner/outer metrics before touching variance.”

## Related

- [UCMP worked example](05_UCMP_Worked_Example.md)
- [Traffic share balanced vs min](04_Traffic_Share_Balanced_vs_Min.md)
- [Feasibility condition](../08_DUAL_and_Feasibility/03_Feasibility_Condition.md)

---
