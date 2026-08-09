# next-hop-self

iBGP normally **preserves** the eBGP NEXT_HOP. If internal routers cannot route to that external link address, they may hold a BGP path whose next hop is **unresolved**—visible in BGP, absent from the RIB/FIB ([NEXT_HOP](../08_Path_Attributes/06_NEXT_HOP.md)).

**next-hop-self** rewrites the advertised next hop to an address of the advertising iBGP speaker (often a loopback). Internal routers then resolve the edge router through the IGP.

## When to use it

| Use case | Why |
|---|---|
| Internet edge → core | Core lacks routes to every eBGP subnet |
| RR designs | Controlled, stable next hops |
| Some VPN/EVPN edges | Align NH with transport tunnel endpoints |

## When **not** to force it

Preserving external next hops can enable **direct forwarding** (no trombone to the advertising PE) when the underlay already reaches the CE/PE link or IX fabric. Decide from the intended data path. Related: [Next Hop Unchanged](09_Next_Hop_Unchanged.md) for eBGP third-party NH designs.

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 10.0.0.2 remote-as 65000
 neighbor 10.0.0.2 update-source Loopback0
 neighbor 10.0.0.2 next-hop-self
 ! Per-AF variant on some platforms:
 address-family ipv4
  neighbor 10.0.0.2 next-hop-self
 exit-address-family
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
| IGP metric | Hot-potato among edges after NHS ([IGP Cost](../10_Best_Path/05_eBGP_iBGP_and_IGP_Cost.md)) |
| AIGP | Accumulated metric may matter more than local IGP-to-NH in seamless designs |
| RR | RR may set NH self or preserve—document the model |
| Multipath | Multiple edges with NHS → ECMP via different loopbacks |

## Verification

```text
show ip bgp 203.0.113.0/24
! Next Hop should be edge loopback when NHS applied
show ip route 10.0.0.1
show ip cef 203.0.113.10
```

Lab: without NHS, withdraw IGP reachability to eBGP subnet → inaccessible; with NHS → resolves via loopback.

## Risks

- NHS everywhere causing unnecessary tromboning.
- NHS to a non-advertised loopback → recursive failure.
- Inconsistent NHS on only some AF (v4 yes, v6 no).

## Interview framing

“next-hop-self rewrites iBGP NEXT_HOP to the speaker so cores resolve via IGP; preserving eBGP next hops is valid when the underlay reaches them and you want direct forwarding.”

---
