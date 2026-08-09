# IPv4 NLRI with an IPv6 Next Hop

RFC 8950 (formerly draft-ietf-bess-ipv4-nlri-ipv6-nh) allows **IPv4 unicast NLRI** to be advertised with an **IPv6 next-hop** address using MP-BGP. This supports IPv6-only underlays that still need to carry IPv4 reachability (common in modern DC fabrics and some SP edges).

## Problem it solves

Classic IPv4 BGP next hops are IPv4 addresses. On an IPv6-only fabric there is no IPv4 underlay address to use as NEXT_HOP, yet servers or PE VRFs still need IPv4 routes. RFC 8950 encodes an IPv6 next hop in MP_REACH_NLRI alongside IPv4 prefixes.

## Requirements

| Requirement | Why |
|---|---|
| Capability signaling | Both peers must advertise support for IPv4 NLRI with IPv6 NH |
| Correct MP encoding | Next-hop length/address fields must follow RFC 8950 |
| Recursive IPv6 reachability | FIB must resolve the IPv6 NH via underlay |
| Data-plane encapsulation | Often SRv6, 4via6, MPLS, or other overlay—not plain IPv4 hop-by-hop |

A working IPv6 BGP **transport** (TCP over IPv6) is not the same as RFC 8950 next-hop support.

## Control vs data plane

```text
BGP:  IPv4 prefix 192.0.2.0/24  NEXT_HOP = 2001:db8::1
RIB:  recurse 2001:db8::1 via IPv6 underlay / tunnel
FIB:  encapsulate IPv4 packet toward that transport
```

If recursion or encapsulation is missing, the route may sit in BGP as valid/invalid depending on platform, but forwarding fails.

## Configuration patterns

Platform syntax varies widely. Conceptual Junos-style:

```text
set protocols bgp group FABRIC family inet unicast extended-nexthop
set protocols bgp group FABRIC neighbor 2001:db8::2
```

Cisco / FRR equivalents use extended next-hop capability knobs under the IPv4 address-family toward IPv6-transport neighbors. Confirm the exact knob for your train before lab certification.

## Troubleshooting chain

1. Confirm IPv4 NLRI was received (`show bgp ipv4 unicast`).
2. Read the next hop—must be IPv6 (`show bgp … detail`).
3. Resolve that IPv6 address in the underlay (`show ipv6 route`).
4. Verify encapsulation / adjacency for IPv4-over-IPv6 forwarding.
5. Ping/traceroute IPv4 only after FIB programming is confirmed.

## Interactions

| Mechanism | Relationship |
|---|---|
| **Ordinary IPv6 unicast** | Different AFI/SAFI payload |
| **6PE / LU** | Related “IPv6 core carrying other traffic” designs; labels vs 8950 NH |
| **EVPN / VXLAN** | Overlay may carry IPv4 VM routes with VTEP next hops—separate family |
| **next-hop-unchanged** | Still relevant across route-servers; see [12/09](../12_eBGP_and_iBGP/09_Next_Hop_Unchanged.md) |

## Risks

- Mixed peers: some honor extended NH, some ignore/reset—capability mismatch.
- Monitoring tools that assume IPv4 next hops break graphs and alerts.
- Blackhole if IPv4 route installs pointing at an IPv6 NH with no encap.

## Interview framing

“RFC 8950 lets MP-BGP advertise IPv4 prefixes with an IPv6 next hop so IPv6-only underlays can still carry IPv4; you must validate capability, IPv6 recursion, and the actual encapsulation path.”

---
