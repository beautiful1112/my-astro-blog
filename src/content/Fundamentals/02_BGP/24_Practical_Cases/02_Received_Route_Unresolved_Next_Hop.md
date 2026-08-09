# Case: Received Route with an Unresolved Next Hop

## Scenario

Edge reflects an eBGP-learned prefix into iBGP without next-hop-self. Core RR clients show the prefix in BGP with NEXT_HOP = eBGP peer IP on the edge LAN. Traceroute blackholes.

## Expected evidence

```text
show bgp ipv4 unicast 203.0.113.0/24
! Next Hop 192.0.2.1 (eBGP peer), best
show ip route 192.0.2.1
! empty / wrong VRF
show ip cef 203.0.113.1
! drop or incomplete
```

## Config touchpoints

```text
! On edge toward iBGP core:
neighbor 10.0.0.1 next-hop-self
! Or advertise the peering LAN /32 into IGP (less common for Internet edge)
```

If the design is IXP route-server style, use [next-hop-unchanged](../12_eBGP_and_iBGP/09_Next_Hop_Unchanged.md) only when receivers can resolve the third-party NH on the LAN.

## Verification

After next-hop-self + soft-out: clients show NH = edge loopback; `show ip route` to that loopback via IGP; CEF complete; traceroute succeeds.

## Lesson

Best BGP path with unresolved NH is a forwarding failure. See [Unresolved Next Hop](../23_Troubleshooting/08_Unresolved_Next_Hop.md).
## Cross-links

Use the matching troubleshooting or interview note if this case appears in an incident; keep evidence (show output + probe) with the ticket.

---
