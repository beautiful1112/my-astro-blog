# eBGP versus iBGP

**eBGP** peers use different ASNs; **iBGP** peers use the same ASN. Many operational defaults follow from that split—ASN prepend behavior, NEXT_HOP handling, and advertisement rules—but TTL, next-hop, and policy defaults remain platform-specific and must be verified.

## Common default differences

| Topic | eBGP (typical) | iBGP (typical) |
|---|---|---|
| ASN in OPEN | Different remote-as | Same ASN both sides |
| AS_PATH on advertise | Prepend local ASN | Do not prepend local ASN |
| NEXT_HOP | Often set to local peering address | Often **preserve** existing next hop |
| Split horizon | Advertise eligible routes per policy | Do not advertise iBGP-learned routes to other iBGP peers (unless RR/confederation) |
| TTL / reachability | Often TTL 1 / directly connected | Often loopbacks + IGP multihop |
| Admin distance (Cisco-ish) | eBGP AD 20 | iBGP AD 200 |

These are widespread behaviors and teaching defaults, not a substitute for reading the running config and RFC/implementation notes.

Related: [Direct and multihop eBGP](../04_Sessions_and_Transport/02_Direct_and_Multihop_eBGP.md), [Update source and loopbacks](../04_Sessions_and_Transport/03_Update_Source_and_Loopbacks.md), [Next-hop resolution](../07_RIBs_and_Updates/04_Next_Hop_Resolution.md).

## Why iBGP split horizon exists

Without route reflection or confederations, iBGP assumes a **full mesh** so that a route learned from one internal peer is not re-advertised to another. That prevents iBGP routing loops given that AS_PATH does not gain the local ASN on iBGP advertisements.

Scaling alternatives (later modules): route reflectors, confederations, and ADD-PATH for path diversity.

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 neighbor 10.0.0.2 remote-as 65000
 neighbor 10.0.0.2 update-source Loopback0
 neighbor 10.0.0.2 next-hop-self
 address-family ipv4
  neighbor 198.51.100.1 activate
  neighbor 10.0.0.2 activate
```

### Junos

```text
set protocols bgp group EXT type external
set protocols bgp group EXT peer-as 64496
set protocols bgp group EXT neighbor 198.51.100.1
set protocols bgp group INT type internal
set protocols bgp group INT local-address 10.0.0.1
set protocols bgp group INT neighbor 10.0.0.2
set protocols bgp group INT export NHS
```

### FRRouting

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 neighbor 10.0.0.2 remote-as 65000
 neighbor 10.0.0.2 update-source lo
 address-family ipv4 unicast
  neighbor 198.51.100.1 activate
  neighbor 10.0.0.2 activate
  neighbor 10.0.0.2 next-hop-self
 exit-address-family
```

## Interactions

| Mechanism | Interaction |
|---|---|
| LOCAL_PREF | Meaningful across iBGP; not normally sent on eBGP |
| MED | Often compared among eBGP paths from the same AS (vendor/default dependent) |
| Route reflection | Relaxes iBGP mesh; changes who may advertise what |
| Confederations | eBGP-like segments inside a confederation AS |

## Verification

```text
show bgp summary
show ip bgp neighbors 10.0.0.2
show ip bgp 203.0.113.0/24
! look for i vs external path indicators and NEXT_HOP
show ip bgp neighbors 10.0.0.2 advertised-routes
```

Lab checks:

1. Learn prefix on edge via eBGP; reflect/mesh to iBGP; confirm AS_PATH does not gain local ASN internally.
2. Without next-hop-self or IGP to CE subnet, observe inaccessible iBGP paths.
3. Advertise an iBGP-learned route to another iBGP peer without RR → should not propagate.

## Risks

- Assuming eBGP TTL-1 always → breaks loopback eBGP without multihop/GTSM design.
- Forgetting split horizon → “missing routes” in partial iBGP meshes.
- Mixing local-AS / AS override without understanding eBGP semantics → loops or dropped paths.

## Interview framing

“eBGP is between ASNs and typically prepends AS_PATH and updates NEXT_HOP; iBGP stays inside one ASN, preserves next hop by default, and will not re-advertise iBGP-learned routes to other iBGP peers without RR or confederation.”

---
