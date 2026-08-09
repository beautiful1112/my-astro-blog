# NEXT_HOP

NEXT_HOP tells the receiving router where to forward traffic for the advertised NLRI. A BGP path is usable only if that address can be **resolved recursively** through the routing table (and any required tunnel/transport). “Session Established” proves none of this.

## Typical behavior

| Session / feature | NEXT_HOP behavior |
|---|---|
| Classic eBGP on a shared subnet | Advertising router sets NEXT_HOP to its interface address on that link |
| iBGP | Usually **preserves** the existing NEXT_HOP (often the eBGP edge address) |
| **next-hop-self** | Rewrites to an address of the advertising iBGP speaker; see [next-hop-self](../12_eBGP_and_iBGP/03_Next_Hop_Self.md) |
| **next-hop-unchanged** | Keeps third-party next hop across eBGP in special designs; see [Next Hop Unchanged](../12_eBGP_and_iBGP/09_Next_Hop_Unchanged.md) |
| MP-BGP (VPN/EVPN/IPv6) | Next-hop carried in `MP_REACH_NLRI`, not always the classic attribute |

Third-party next hops (advertising a next hop that is not the speaker itself) appear in multiaccess and some route-server designs. Receivers must still resolve that address.

## Eligibility and RIB installation

If NEXT_HOP is unresolved:

- The path may remain in the BGP table but be **ineligible** / not installed in the main RIB.
- An IGP (or static/tunnel) change can invalidate many BGP paths at once.
- Best-path among remaining eligible paths can shift when resolution returns.

Diagnostic chain: BGP next hop → recursive route → final adjacency/tunnel → egress interface/FIB.

## Configuration patterns

### Cisco IOS / IOS XE — next-hop-self on iBGP

```text
router bgp 65000
 neighbor 10.0.0.2 remote-as 65000
 neighbor 10.0.0.2 update-source Loopback0
 neighbor 10.0.0.2 next-hop-self
```

### Junos

```text
set protocols bgp group IBGP type internal
set protocols bgp group IBGP local-address 10.0.0.1
set protocols bgp group IBGP export NHS
set policy-options policy-statement NHS term 1 then next-hop self
```

### FRRouting

```text
router bgp 65000
 neighbor 10.0.0.2 remote-as 65000
 neighbor 10.0.0.2 update-source lo
 address-family ipv4 unicast
  neighbor 10.0.0.2 next-hop-self
 exit-address-family
```

## Interactions

| Mechanism | Interaction |
|---|---|
| IGP cost to next hop | Hot-potato selection after higher attributes; see [eBGP/iBGP and IGP Cost](../10_Best_Path/05_eBGP_iBGP_and_IGP_Cost.md) |
| AIGP | Accumulates interior cost across trusted domains; related but not the same as NEXT_HOP resolution ([AIGP](11_AIGP.md)) |
| Route reflectors | RR must advertise a resolvable next hop; path hiding can hide a better next hop |
| MPLS / SR transport | VPN next hop often resolves via BGP-LU / IGP-SR, not plain IP |
| Disable-connected-check | Multihop eBGP without TTL tricks; next hop still must resolve |

## Verification

```text
show ip bgp 192.0.2.0/24
show ip route 192.0.2.1
! Is the BGP next hop reachable?
show ip cef 203.0.113.10
show bgp ipv4 unicast 192.0.2.0/24
```

Lab checks:

1. Advertise eBGP route into iBGP **without** next-hop-self; withdraw IGP reachability to the eBGP subnet → path ineligible.
2. Enable next-hop-self → resolve via loopback / IGP.
3. Confirm FIB egress matches intended edge.

## Risks

- Preserving external next hops without underlay reachability → silent blackholes.
- next-hop-self everywhere → unnecessary tromboning when direct PE-CE or IX fabrics could forward.
- Recursive loops (BGP next hop resolved only by another BGP route that depends on it).

## Interview framing

“NEXT_HOP must recursively resolve or the path is unusable; iBGP often preserves the eBGP next hop, so next-hop-self or underlay reachability is a design choice, not an automatic default.”

---
