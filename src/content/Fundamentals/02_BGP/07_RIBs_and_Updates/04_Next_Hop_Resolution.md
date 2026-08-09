# Next-hop resolution

A BGP path is usable only if its **NEXT_HOP** is resolvable in the local routing table (and any required tunnel/transport). iBGP often **preserves** an external next hop, so internal speakers need IGP/static reachability to that address—or an edge router must apply **next-hop-self**.

“Session Established” and “prefix in BGP table” prove neither resolution nor FIB install.

## Resolution chain

```text
BGP NEXT_HOP
  -> recursive lookup in RIB
  -> IGP/static/BGP-LU/tunnel endpoint
  -> adjacency / label / encapsulation
  -> FIB egress
```

Resolution may recurse through an IGP route, MPLS/SR transport, or another BGP route. Excessive or cyclic recursion prevents installation. A session and prefix can both look present while the path is marked **inaccessible** / not installed.

Related: [Control plane versus data plane](../02_Fundamentals/04_Control_Plane_vs_Data_Plane.md), [eBGP versus iBGP](../03_ASNs_and_Peering/02_eBGP_vs_iBGP.md), [Update source and loopbacks](../04_Sessions_and_Transport/03_Update_Source_and_Loopbacks.md).

## Common design choices

| Design | NEXT_HOP behavior | When used |
|---|---|---|
| Preserve eBGP next hop into iBGP | Needs IGP reachability to edge subnets | Clos fabrics with host routes / shared LAN |
| next-hop-self | Rewrites to speaker address (often loopback) | Classic SP edge |
| next-hop-unchanged | Keep third-party hop across eBGP | Some IX / RS designs |
| BGP-LU / tunnels | Resolve via transport tunnel | MPLS/SR VPN cores |

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 10.0.0.2 remote-as 65000
 neighbor 10.0.0.2 update-source Loopback0
 neighbor 10.0.0.2 next-hop-self
```

### Junos

```text
set policy-options policy-statement NHS term 1 then next-hop self
set protocols bgp group IBGP type internal
set protocols bgp group IBGP local-address 10.0.0.1
set protocols bgp group IBGP export NHS
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
| IGP cost to next hop | Influences hot-potato choice after higher BGP attributes |
| Route reflectors | Must advertise a resolvable next hop to clients |
| PIC | Needs pre-resolved backup next hops |
| Disable-connected-check / multihop | Session may be up while next hop still unresolved |

## Verification

```text
show ip bgp 203.0.113.0/24
show ip route 198.51.100.1
! Is the BGP next hop reachable?
show ip cef 203.0.113.10
show route 203.0.113.0/24 extensive
```

Lab checks:

1. iBGP without next-hop-self; remove IGP route to CE subnet → path inaccessible.
2. Enable next-hop-self → resolves via loopback.
3. Introduce recursive loop (NEXT_HOP only reachable via the same BGP prefix) → observe failure.

## Risks

- Silent blackholes when sessions stay up but next hops die.
- next-hop-self everywhere causing unnecessary tromboning.
- Assuming ping to peer equals resolution of *NLRI* next hops (different addresses).

## Interview framing

“A BGP route is unusable until NEXT_HOP recursively resolves; iBGP often preserves the eBGP next hop, so either the underlay must reach that address or you rewrite with next-hop-self.”

---
