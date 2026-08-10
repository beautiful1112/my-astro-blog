# Case: Summary blackhole (Null0 missing / misunderstood)

## Topology

```text
Border BR1 summarizes 10.10.0.0/16 toward core
Specific 10.10.8.0/24 withdrawn (VLAN decommission)
Component route gone but summary still advertised
```

## Symptom

Remote users to decommissioned subnet get unexplained drops. More dangerously: traffic for **holes** inside the summary hits BR1 and disappears. On some platforms/ops stories, engineers disable Null0 incorrectly while troubleshooting and create loops.

## Evidence

```text
! BR1
show ip route 10.10.0.0 255.255.0.0
! D 10.10.0.0/16 is a summary, Null0 [5/...]
show ip route 10.10.8.1
! Null0 via summary
traceroute from remote → arrives BR1 then stops
```

If Null0 were absent/removed, BR1 might follow a less-specific default back toward the core → **routing loop** until TTL expires.

## Root cause

Summarization installs a **Null0 discard** route (AD 5) so traffic for unknown components is dropped locally instead of looped. Blackhole for holes is **expected** when the summary is advertised but specifics are gone. The incident becomes severe when someone removes Null0 “to fix blackhole” without fixing the address plan.

## Fix

1. Keep Null0; treat hole blackhole as correct while summary exists.
2. Remove or shrink the summary if those components should be unreachable via a different path.
3. Use leak-map if a specific exception must remain visible.
4. Never delete Null0 as a troubleshooting step.

```text
interface GigabitEthernet0/0
 ip summary-address eigrp 100 10.10.0.0 255.255.0.0
!
show ip route 10.10.0.0
! confirm Null0 present
```

## Interview takeaway

“EIGRP summary Null0 prevents loops into holes; a blackhole for missing components is by design—removing Null0 risks a loop.”

## Operator error pattern

Ticket note “removed ip route Null0 to restore connectivity” is a red flag in postmortems. Restore Null0, then fix summaries or re-inject specifics. Add monitoring for disappearance of summary Null0 routes.

## Related

- [Hierarchical Addressing](../18_Scale_and_Design/01_Hierarchical_Addressing.md)
- [Default Route Injection](../15_Redistribution_and_AD/07_Default_Route_Injection.md)

---
