# IPv6 Unicast over MP-BGP

IPv6 unicast (AFI 2, SAFI 1) is carried with **MP_REACH_NLRI** / **MP_UNREACH_NLRI**, not the classic IPv4 NLRI fields. Everything about peer activation, policy, and next-hop resolution must be verified in the IPv6 family explicitly.

## Next-hop encoding

MP_REACH for IPv6 typically carries:

- a global IPv6 next hop; and
- in some link-local / on-link designs, a link-local next hop as well.

Recursive resolution must succeed in the **IPv6** RIB (or appropriate VRF). An IPv4 next hop cannot forward IPv6 NLRI.

## Operational checklist

| Check | Failure symptom |
|---|---|
| IPv6 unicast capability both ways | Family missing in negotiated NLRI |
| `neighbor activate` under IPv6 AF | Session up, zero IPv6 prefixes |
| IPv6 import/export policy | Routes received but not accepted / not advertised |
| Next hop resolves in IPv6 | Route in BGP, not in RIB/FIB |
| Independent prefix filters | IPv4 filters accidentally empty IPv6 |
| 32-bit router-ID still set | Session / RR issues in IPv6-only transports |

Dual-stack peers may share one TCP session (IPv4 or IPv6 transport) carrying both families, or use separate sessions—platform and design dependent.

## Configuration patterns

### Cisco IOS XE

```text
router bgp 65000
 neighbor 2001:db8::2 remote-as 65000
 neighbor 2001:db8::2 update-source Loopback0
 address-family ipv6
  neighbor 2001:db8::2 activate
  neighbor 2001:db8::2 route-map V6-OUT out
  network 2001:db8:10::/48
 exit-address-family
```

### Junos

```text
set protocols bgp group IBGP family inet6 unicast
set protocols bgp group IBGP neighbor 2001:db8::2
set policy-options policy-statement V6-EXPORT …
```

### FRR

```text
router bgp 65000
 neighbor 2001:db8::2 remote-as 65000
 address-family ipv6 unicast
  neighbor 2001:db8::2 activate
  network 2001:db8:10::/48
 exit-address-family
```

## Interactions

| Mechanism | Note |
|---|---|
| **IPv4 unicast** | Independent table—do not assume parity |
| **RFC 8950** | IPv4 NLRI with IPv6 next hop is a different feature—[03](03_IPv4_NLRI_with_IPv6_Next_Hop.md) |
| **6PE / labeled unicast** | May add MPLS labels to IPv6 reachability |
| **RR / ADD-PATH** | Enable reflection and ADD-PATH under the IPv6 family |
| **GTSM / MD5 / TCP-AO** | Transport security is per session, not per family |

## Verification

```text
show bgp ipv6 unicast summary
show bgp ipv6 unicast 2001:db8:10::/48
show ipv6 route 2001:db8:10::/48
show bgp neighbors 2001:db8::2
```

Confirm next-hop address family, IGP/IS-IS IPv6 reachability to the peer loopback, and that advertised-routes on the far end match policy.

## Interview framing

“IPv6 unicast rides MP-BGP with its own capability, activation, policy, and IPv6 next-hop resolution—never assume it works because IPv4 BGP is Established.”

---
