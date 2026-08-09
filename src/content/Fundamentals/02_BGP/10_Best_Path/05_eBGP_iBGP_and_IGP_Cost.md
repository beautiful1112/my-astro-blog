# eBGP vs iBGP and IGP Cost to Next Hop

When higher attributes tie, many implementations prefer an **eBGP-learned** path over an **iBGP-learned** path. Later, the router may compare **IGP distance to each BGP NEXT_HOP**—commonly called **hot-potato routing** or closest exit.

## What each step optimizes

| Step | Optimizes | Does not optimize |
|---|---|---|
| Prefer eBGP over iBGP | Avoid reflecting external paths internally when an external copy exists | End-to-end latency |
| Lower IGP metric to NEXT_HOP | Exit closest in **interior cost** | Remote path quality, congestion, delay |
| AIGP (if enabled) | Accumulated interior cost across trusted BGP boundaries | Measured RTT ([AIGP](../08_Path_Attributes/11_AIGP.md)) |

Hot-potato routing can move Internet egress when **only the IGP** changes—no BGP attribute change required. Different routers in the same AS can choose different exits.

## AIGP vs classic IGP-to-next-hop

| Classic IGP cost | AIGP |
|---|---|
| Distance from this router to the BGP NEXT_HOP | Sum of interior costs advertised across a trusted domain |
| Always local topology | Comparable across member AS / seamless MPLS designs |
| Used when AIGP absent or feature off | Used when feature on and attribute present |

Do not enable AIGP on untrusted eBGP. For cold-potato / performance exits, raise LOCAL_PREF or use TE communities instead of hoping IGP cost matches latency.

## Configuration patterns

### Cisco IOS / IOS XE

```text
! IGP (example) — metrics influence hot-potato among equal BGP paths
router ospf 1
 network 10.0.0.0 0.255.255.255 area 0
!
router bgp 65000
 neighbor 10.0.0.2 remote-as 65000
 neighbor 10.0.0.2 next-hop-self
 maximum-paths 4
```

### Junos

```text
set protocols bgp group IBGP type internal
set protocols bgp group IBGP local-address 10.0.0.1
set protocols ospf area 0.0.0.0 interface ae0 metric 100
```

### FRRouting

```text
router bgp 65000
 neighbor 10.0.0.2 remote-as 65000
 address-family ipv4 unicast
  neighbor 10.0.0.2 next-hop-self
 exit-address-family
```

## Distinguish three “distances”

1. **BGP best path** — attribute ladder.  
2. **RIB administrative distance** — whether BGP wins over static/OSPF for installation.  
3. **IGP metric to NEXT_HOP** — hot-potato among eligible BGP paths.

A “best BGP route loses to static” problem is AD/RIB, not step 8 of BGP selection. See troubleshooting modules outside this scope.

## Verification

```text
show ip bgp 192.0.2.0/24
show ip route 192.0.2.1
! Metric to next hop
show ip ospf database
show bgp ipv4 unicast 192.0.2.0/24
```

Lab: two exits with equal LP/AS_PATH; raise IGP metric toward exit A → traffic shifts to B. Repeat with AIGP enabled and unequal AIGP values while IGP-to-NH equal.

## Risks

- Assuming hot-potato equals lowest latency.
- next-hop-self + poor IGP design trombones traffic.
- Mixing AIGP and non-AIGP PEs under one RR without ADD-PATH.

## Interview framing

“After MED, vendors often prefer eBGP over iBGP, then lowest IGP cost to NEXT_HOP for hot-potato; AIGP can replace/augment that interior comparison in trusted domains, while LOCAL_PREF still wins for cold-potato designs.”

---
