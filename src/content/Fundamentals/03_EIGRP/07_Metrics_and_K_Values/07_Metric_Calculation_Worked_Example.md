# Metric calculation worked example

Work a classic default-K metric end-to-end so interview math is automatic. Assumptions: **K1 = 1, K3 = 1, K2 = K4 = K5 = 0**, so:

```text
metric = (BW_term + Delay_term) * 256
BW_term = 10^7 / min_BW_kbps
Delay_term = sum of delays in tens of microseconds
```

Related: [Composite metric formula](01_Composite_Metric_Formula.md), [Bandwidth and delay components](02_Bandwidth_and_Delay_Components.md).

## Topology

```text
R1 ---- 100 Mbps, DLY 100 usec ---- R2 ---- 10 Mbps, DLY 200 usec ---- R3
         (path of interest from R1 to network behind R3)
```

Interpret for the path R1→R2→R3:

| Hop | Bandwidth | Delay (usec) | Delay in tens of usec |
|---|---|---|---|
| R1–R2 | 100000 kbps | 100 | 10 |
| R2–R3 | 10000 kbps | 200 | 20 |

## Step-by-step

1. **Minimum bandwidth** = 10000 kbps (the 10 Mbps hop).

2. **BW_term** = `10^7 / 10000` = **1000**.

3. **Delay_term** = 10 + 20 = **30**.

4. **Composite** = `(1000 + 30) * 256` = `1030 * 256` = **263680**.

```text
metric = 263680
```

That value is what you expect to see (approximately, depending on exact interface defaults) as the local metric along that path in classic topology output.

## Successor comparison sketch

Suppose alternate path R1→R4→R3 has min BW 100000 kbps and delay tens sum 100:

```text
BW_term = 10^7/100000 = 100
Delay_term = 100
metric = (100+100)*256 = 51200
```

51200 < 263680 → alternate wins as successor under defaults (higher BW, despite checking delay).

## Configuration patterns (recreate in lab)

### Cisco IOS / IOS XE

```text
interface Serial0/0
 bandwidth 10000
 delay 20
!
interface GigabitEthernet0/0
 bandwidth 100000
 delay 10
!
router eigrp 100
 network 10.0.0.0 0.255.255.255
 metric weights 0 1 0 1 0 0
```

Match delay command units to your IOS doc (`delay` in tens of microseconds).

## Verification

```text
show interfaces | include BW|DLY
show ip eigrp topology
! compute by hand, then compare to (metric/RD) display
```

Lab checks:

1. Reproduce 10 Mbps bottleneck math within rounding of CLI.
2. Raise backup delay until primary wins.
3. Repeat with wide metrics and note display change—not the classic hand formula.

## Risks

- Using Mbps directly in `10^7/BW` without converting to kbps.
- Summing bandwidth or taking minimum delay (inverted rules).
- Forgetting `* 256`.

## Interview framing

“Classic default EIGRP metric is (10^7/min_BW_kbps + sum_of_delays_in_tens_of_usec) × 256—I can compute it on a two-hop path and match `show ip eigrp topology`.”

---
