# Route missing from topology

Neighbor is up, but `show ip eigrp topology P` lacks the prefix. The control plane never learned it (or filtered it out of topology).

## Cause map

| Cause | Where to look |
|---|---|
| Upstream never advertised | Split horizon, stub flags, missing network |
| Distribute-list / route-map in | `show ip protocols` |
| Summary hid specific | Hub summary; expect aggregate only |
| Different AS without redistribute | Second process isolated |
| Offset/filter on peer | Peer outbound policy |
| Query incomplete / Active | `topology active` |

## Hub-spoke classic

Spoke-2 lacks Spoke-1 LAN: hub multipoint **split horizon** ([case](../21_Practical_Cases/02_Spoke_Missing_Routes_Split_Horizon.md)).

## Evidence

```text
show ip eigrp neighbors
show ip eigrp topology P
show ip eigrp topology all-links
show ip protocols
show run | section distribute|stub|summary|eigrp
! on advertiser:
show ip eigrp topology P
```

Ask: does the **originating** router have P in topology as local/successor?

## Config touchpoints

```text
! hub multipoint mitigation example
interface Tunnel0
 no ip split-horizon eigrp 100
!
! or prefer summary/default toward spokes
 ip summary-address eigrp 100 0.0.0.0 0.0.0.0
```

## Interview framing

“If topology lacks the prefix, the advertiser, split horizon, stub, summary, or inbound filter failed—not the RIB AD.”

## Spoke receive-only trap

A spoke with `eigrp stub receive-only` advertises nothing. Hubs and other sites will not see its LANs unless another mechanism injects them. Confirm stub options when a site’s prefixes are globally missing.

## Summary vs filter

If only the aggregate exists, the specific is not “missing”—it is hidden by design. Escalate only if the specific must be visible (leak-map / no summary).

## Related

- [NBMA and Multipoint](../17_WAN_NBMA_and_Tunnels/02_NBMA_and_Multipoint.md)
- [Spoke Missing Routes Split Horizon](../21_Practical_Cases/02_Spoke_Missing_Routes_Split_Horizon.md)
- [Route in Topology Not in RIB](05_Route_in_Topology_Not_in_RIB.md)

---
