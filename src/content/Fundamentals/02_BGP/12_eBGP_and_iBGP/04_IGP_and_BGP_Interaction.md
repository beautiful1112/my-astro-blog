# IGP and BGP Interaction

The IGP should normally provide stable reachability to **router loopbacks** and **BGP next hops**. BGP carries policy-rich external or service routes. Blurring those roles causes scale and loop problems.

## Important interactions

| Interaction | Effect |
|---|---|
| Unresolved BGP NEXT_HOP | Path ineligible / not installed |
| IGP metric change | Hot-potato exit shift without BGP attribute change |
| Redistributing full Internet into IGP | Unsafe and unnecessary |
| Redistributing IGP into BGP without policy | Leaks infrastructure space |
| IGP convergence before BGP usable | Recursive dependency after failures |
| AIGP | Carries accumulated IGP-like cost in BGP across trusted domains ([AIGP](../08_Path_Attributes/11_AIGP.md)) |

Keep responsibilities explicit: **IGP reaches the BGP next hop; BGP chooses which destination path is preferred.**

## Design patterns

```text
Loopbacks in IGP
eBGP edges learn external prefixes
iBGP distributes with next-hop-self (or resolvable NH)
Cores recurse: destination → BGP NH → IGP → interface
```

Avoid mutual redistribution. If redistribution is required, use tags, prefix limits, and one-way route-maps.

## Configuration patterns

### Cisco IOS / IOS XE

```text
router ospf 1
 network 10.0.0.0 0.255.255.255 area 0
 passive-interface default
 no passive-interface Loopback0
!
router bgp 65000
 neighbor 10.0.0.2 remote-as 65000
 neighbor 10.0.0.2 update-source Loopback0
 neighbor 10.0.0.2 next-hop-self
 ! Do NOT: redistribute bgp into ospf for Internet table
```

### Junos

```text
set protocols ospf area 0.0.0.0 interface lo0.0 passive
set protocols ospf area 0.0.0.0 interface ae0.0
set protocols bgp group IBGP local-address 10.0.0.1
set protocols bgp group IBGP type internal
```

### FRRouting

```text
router ospf
 network 10.0.0.0/8 area 0
!
router bgp 65000
 neighbor 10.0.0.2 remote-as 65000
 neighbor 10.0.0.2 update-source lo
```

## Interactions with selection and TE

| Topic | Link |
|---|---|
| Hot-potato | [eBGP/iBGP and IGP Cost](../10_Best_Path/05_eBGP_iBGP_and_IGP_Cost.md) |
| NEXT_HOP resolution | [NEXT_HOP](../08_Path_Attributes/06_NEXT_HOP.md) |
| Cold-potato | Higher LOCAL_PREF to keep traffic on preferred edge |

## Verification

```text
show ip route 10.0.0.1
show ip bgp 203.0.113.0/24
show ip cef 203.0.113.10
! Confirm recursion depth and final interface
traceroute 203.0.113.10
```

Failure lab: shut IGP adjacency to advertising edge → BGP path goes inaccessible even if eBGP session elsewhere still up.

## Risks

- IGP carrying subscriber/Internet routes.
- BGP carrying only underlay loopbacks without a real IGP (possible in some DC fabrics—but then BGP *is* the IGP; document that model).
- Flapping IGP metrics causing BGP exit oscillation.
- Blackholes when NHS loopback is missing from IGP.

## Interview framing

“IGP reaches BGP next hops; BGP selects policy-rich destinations—don’t redistribute the Internet into the IGP, and remember IGP metric changes can move hot-potato egress.”

---
