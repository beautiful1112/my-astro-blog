# Final BGP Tie-Breakers

When meaningful policy and path metrics tie, implementations need **deterministic** final criteria. These exist for stability and reproducibility—not business intent.

## Common final steps (vendor-dependent order)

| Tie-breaker | Typical preference | Intent |
|---|---|---|
| Oldest external path | Prefer older eBGP path | Reduce churn / route oscillation |
| Lowest BGP router ID | Prefer path from lower RID speaker | Determinism |
| Shortest CLUSTER_LIST | Prefer shorter RR cluster list | Prefer “closer” reflection path |
| Lowest neighbor address | Prefer lower peer IP | Last resort determinism |
| Lowest ORIGINATOR_ID | RR-specific | Determinism with reflection |

Exact placement differs (e.g. whether “oldest path” is before or after RID). Always read the platform’s decision table.

## Why production should not rely on them

If live traffic depends on router-ID or neighbor-address, policy is **underspecified**. Replacing a router, changing a loopback, or renumbering a peer can silently move traffic.

Prefer an earlier deliberate knob:

- LOCAL_PREF / communities  
- MED (coordinated)  
- Prefers eBGP exit via policy  
- AIGP only inside trusted domains ([AIGP](../08_Path_Attributes/11_AIGP.md))

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 bgp router-id 192.0.2.1
 ! Optional: disable prefer-oldest behavior on some releases carefully
 ! bestpath compare-routerid
```

### Junos

```text
set routing-options router-id 192.0.2.1
set protocols bgp path-selection router-id
```

### FRRouting

```text
router bgp 65000
 bgp router-id 192.0.2.1
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Route reflectors | CLUSTER_LIST / ORIGINATOR_ID become decisive more often |
| ADD-PATH | More candidates visible; may avoid RID-based surprises—or expose them |
| Multipath | Tie-breakers still pick the advertised “best”; multiple may forward |
| Graceful restart / stale paths | Age-based preference can interact badly with stale timers |

## Verification

```text
show ip bgp 192.0.2.0/24
! Compare Router IDs, cluster lists, peer addresses among tied paths
show bgp ipv4 unicast 192.0.2.0/24 bestpath
```

Lab: equalize LP, AS_PATH, ORIGIN, MED, eBGP/iBGP, IGP cost; change BGP router-id on one peer and observe winner flip—then add explicit LP so RID no longer matters.

## Risks

- RID renumbering during maintenance causing traffic shifts.
- Assuming “oldest path” always means “best path quality.”
- Debugging RID when an earlier attribute actually differs (hidden inequality).

## Interview framing

“Final tie-breakers (age, router-ID, cluster-list, peer address) exist for determinism; if production depends on them, add an explicit earlier preference.”

---
