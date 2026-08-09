# NLRI and longest-prefix match

BGP selects a **best path separately for each NLRI** (each distinct prefix length and address). Packet forwarding then uses **longest-prefix match (LPM)** across whatever routes are installed in the RIB/FIB—from BGP, IGP, static, connected, and others.

Therefore a less-preferred BGP `/24` still wins **packet forwarding** over a highly preferred covering `/16` if both are installed. BGP attributes compare competing paths for the **same** NLRI; they do not override forwarding LPM.

## Two decision layers

| Layer | Question | Compared among |
|---|---|---|
| BGP best-path | Which path wins for this exact NLRI? | Paths for `203.0.113.0/24` only |
| FIB LPM | Which installed route matches the packet? | `/32`, `/24`, `/16`, default, … |

This distinction explains many traffic-engineering surprises and hijack impacts: a more-specific wins forwarding even with “worse” attributes than a covering aggregate.

Related: [Three conceptual RIBs](01_Three_Conceptual_RIBs.md), [Control plane versus data plane](../02_Fundamentals/04_Control_Plane_vs_Data_Plane.md), [What BGP is](../02_Fundamentals/01_What_BGP_Is.md).

## Hijack and TE implications

| Scenario | Outcome |
|---|---|
| Attacker originates more-specific | May attract traffic despite longer AS_PATH on the covering prefix elsewhere |
| TE with more-specifics | Local preference on parent does not steer packets hitting the child |
| Aggregation | Withdrawing a more-specific returns traffic to the aggregate’s path attributes |

RPKI ROA `maxLength` interacts here: authorized more-specifics must fit ROA constraints.

## Configuration patterns (more-specific vs aggregate)

### Cisco IOS / IOS XE

```text
router bgp 65000
 address-family ipv4 unicast
  network 203.0.113.0 mask 255.255.255.0
  network 203.0.113.0 mask 255.255.255.128
  aggregate-address 203.0.113.0 255.255.255.0 summary-only
```

### Junos

```text
set policy-options policy-statement ORIGINATE term more from route-filter 203.0.113.0/25 exact
set policy-options policy-statement ORIGINATE term agg from route-filter 203.0.113.0/24 exact
set protocols bgp group EXT export ORIGINATE
```

### FRRouting

```text
router bgp 65000
 address-family ipv4 unicast
  network 203.0.113.0/24
  network 203.0.113.0/25
  aggregate-address 203.0.113.0/24 summary-only
 exit-address-family
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Best-path | Per-NLRI only; never compares `/24` vs `/16` attributes head-to-head |
| Discard routes / RTBH | More-specific null route blackholes despite covering BGP best |
| Multipath | Still per identical NLRI |
| Orphaned more-specific | After withdraw, LPM falls back to covering prefix |

## Verification

```text
show ip bgp 203.0.113.0/24
show ip bgp 203.0.113.0/25
show ip route 203.0.113.10
show ip cef 203.0.113.10
```

Lab checks:

1. Install covering `/16` preferred and `/24` less preferred; traceroute to host in `/24` follows `/24`.
2. Withdraw `/24`; traffic moves to covering path.
3. Show BGP best for each NLRI independently—attributes not cross-compared.

## Risks

- “Fixing” TE with LOCAL_PREF only on aggregates while traffic hits more-specifics.
- Contaminating the table with uncontrolled more-specifics → scale and hijack surface.
- Misreading “best BGP route” as “path packets take.”

## Interview framing

“BGP best-path is per NLRI; forwarding uses longest-prefix match—so a more-specific always beats a covering prefix in the FIB regardless of LOCAL_PREF on the aggregate.”

---
