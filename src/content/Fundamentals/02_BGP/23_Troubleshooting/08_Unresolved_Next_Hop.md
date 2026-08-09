# Unresolved BGP Next Hop

BGP may keep a path as best while recursion fails; forwarding blackholes until the next hop resolves (platform behavior varies on whether “best” requires resolvability).

## Classic scenarios

1. eBGP route redistributed into iBGP **without** next-hop-self, and core has no route to the eBGP peer IP.
2. Wrong VRF: NH in global table, route in VRF (or reverse).
3. IGP island / summarization blackhole to the NH.
4. [next-hop-unchanged](../12_eBGP_and_iBGP/09_Next_Hop_Unchanged.md) toward a peer that cannot reach the third-party NH (route-server style).
5. Third-party NH on shared LAN without `next-hop-self` when not desired.

## Evidence

```text
show bgp ipv4 unicast 203.0.113.0/24
! Next Hop, metric to NH, accessible?
show ip route <next-hop>
show route resolution unresolved          ! Junos
```

## Fixes (pick the design)

```text
neighbor 192.0.2.10 next-hop-self
! or ensure IGP advertises the eBGP peering /32
! or use next-hop-unchanged only when the receiver can resolve the NH
```

See [Next Hop Resolution](../07_RIBs_and_Updates/04_Next_Hop_Resolution.md) and [case](../24_Practical_Cases/02_Received_Route_Unresolved_Next_Hop.md).

## IXP special case

With next-hop-unchanged, resolution requires L2 reachability to the third-party NH on the LAN. BGP “best” with unresolved/incomplete ARP is an IX fabric problem—see [RS case](../24_Practical_Cases/10_Route_Server_Up_Data_Plane_Down.md).

---
