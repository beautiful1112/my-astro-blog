# Route-Reflector Placement and IGP Congruence

The RR’s **IGP view** drives which BGP next hop wins on the RR. If that view differs from a client’s view, the RR may select and expose an exit that is wrong for the client. Control-plane choice and data-plane optimality diverge—**non-congruence**.

## Congruence idea

```text
Client prefers PE-A (IGP 10)
RR prefers PE-B (IGP 5 from RR’s location)
RR reflects PE-B → Client forwards toward PE-B even though PE-A is closer
```

Hot-potato routing inside the AS expects each router to exit toward the closest egress. A distant RR breaks that assumption unless diversity or optimal route reflection (ORR) compensates.

## Placement principles

| Principle | Why |
|---|---|
| Place RRs near the topology they represent | IGP costs resemble client costs |
| Redundant, failure-independent RRs | Avoid shared fate (same line card, same site power) |
| Stable loopback reachability | Sessions and next-hop resolution survive link flaps |
| Consistent cluster policy | Same import/export and ADD-PATH modes on peers |
| Capacity for UPDATE bursts | Full table + ADD-PATH multiplies churn |
| Decide if clients need per-site best paths | Drives ADD-PATH / ORR / hierarchical RR |

The RR need not carry user traffic, but its **topology perspective still steers** client forwarding.

## Hierarchical and regional designs

- **Core RRs** reflect among regional RRs (non-clients) and reduce inter-region mesh.
- **Regional RRs** serve PE clients so path selection is closer to the edge.
- Keep CLUSTER_IDs unique across hierarchy levels unless you intentionally share a cluster.
- For seamless MPLS / multi-area backbones, consider [AIGP](../08_Path_Attributes/11_AIGP.md) so end-to-end interior cost influences RR best-path across area boundaries.

## Configuration reminders

```text
! RR loopback in IGP, not passive-only if peers need reachability
router ospf 1
 network 192.0.2.1 0.0.0.0 area 0

router bgp 65000
 bgp router-id 192.0.2.1
 neighbor RR-CLIENTS peer-group
 neighbor RR-CLIENTS update-source Loopback0
 neighbor 203.0.113.10 peer-group RR-CLIENTS
```

Prefer IGP-independent RR loopbacks advertised consistently; avoid next hops that recurse only through flapping access links.

## Verification

```text
show ip ospf neighbor
show ip route <rr-loopback>
show bgp ipv4 unicast <prefix>
! compare IGP metric to next hops on RR vs on client
traceroute <egress-pe>
```

Lab test: originate the same prefix from two PEs at different IGP distances; confirm which path clients install and whether traffic exits the intended PE.

## Interactions

| Mechanism | Relationship |
|---|---|
| **Path hiding** | Bad placement amplifies suboptimal single-path advertisement |
| **ADD-PATH** | Softens placement mistakes by exposing backups |
| **next-hop-self** | Makes RR the BGP next hop; IGP path to RR then matters for all reflected routes |
| **PIC core/edge** | Needs congruent backup next hops in FIB |
| **ORR / IGP topology import** | Advanced platforms compute per-client best paths |

## Risks

- Collapsing all RRs into one POPs “for simplicity” maximizes non-congruence for far edges.
- Using the RR as an ABR/ASBR traffic hairpin without capacity planning creates data-plane overload during failures.
- Changing IGP metrics under RRs causes mass BGP best-path recomputation—schedule maintenance carefully.

## Interview framing

“RR placement must keep the reflector’s IGP view close to its clients’; otherwise the reflected best path is optimal for the RR, not for the forwarding routers—ADD-PATH and regional RRs restore congruence.”

---
