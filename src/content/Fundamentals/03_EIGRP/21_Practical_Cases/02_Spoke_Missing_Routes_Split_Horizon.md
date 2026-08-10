# Case: Spoke missing routes (split horizon)

## Topology

```text
Spoke1 --(mGRE Tunnel0)-- Hub --(mGRE Tunnel0)-- Spoke2
Spoke1 LAN 10.1.0.0/16    Hub LAN 10.0.0.0/16    Spoke2 LAN 10.2.0.0/16
Hub Tunnel0 is multipoint; split horizon default enabled
```

```mermaid
flowchart LR
  S1["Spoke1"] --- H["Hub multipoint"]
  H --- S2["Spoke2"]
```

## Symptom

Spoke2 reaches hub networks but cannot reach `10.1.0.0/16`. Neighbor to hub is stable. Users blame firewall.

## Evidence

```text
! Spoke2
show ip eigrp neighbors
! hub up
show ip route 10.1.0.0
! no route / only default if present
show ip eigrp topology 10.1.0.0/16
! absent
!
! Hub
show ip eigrp topology 10.1.0.0/16
! successor via Spoke1 on Tunnel0
```

Hub knows the prefix; Spoke2 does not → advertisement problem on the hub’s multipoint interface.

## Root cause

EIGRP **split horizon** on the hub multipoint tunnel suppresses advertising Spoke1’s routes back out Tunnel0 toward Spoke2.

## Fix (pick one design)

**Preferred — summarize/default on hub:**

```text
interface Tunnel0
 ip summary-address eigrp 100 0.0.0.0 0.0.0.0
```

**Or — disable SH on hub multipoint (know the trade-offs):**

```text
interface Tunnel0
 no ip split-horizon eigrp 100
```

**Or — point-to-point tunnels/subinterfaces** so SH applies per spoke circuit.

Verify from Spoke2:

```text
show ip route 10.1.0.0
ping 10.1.1.1
```

## Interview takeaway

“Missing spoke-to-spoke prefixes with a healthy hub neighbor usually means multipoint split horizon—not a LAN ACL.”

## Related

- [NBMA and Multipoint](../17_WAN_NBMA_and_Tunnels/02_NBMA_and_Multipoint.md)
- [Route Missing from Topology](../20_Troubleshooting/04_Route_Missing_from_Topology.md)

---
