# iBGP scale: RR and confederations

iBGP full mesh is O(n²) sessions. **Route reflectors** are the default scale tool; **confederations** are a heavier option when you need AS_PATH-like boundaries inside one admin domain.

```text
Full mesh (bad at scale):     RR (control hub):
  A--B--C--D                    Clients --- RR pair --- Clients
  |\/|\/|                         |           |
  +--+--+                      ORIGINATOR_ID / CLUSTER_LIST
```

RR is a **control-plane** role. It should not become a hidden data-plane chokepoint unless you deliberately pin traffic through it (usually you do not).

## RR design essentials

| Topic | Design rule |
|---|---|
| Redundancy | Paired RRs, diverse power/rack/site |
| Placement | Regional cores / DC cores—not a single branch |
| Clusters | Distinct CLUSTER_IDs; avoid unintended reflection loops |
| Clients | Clear client vs non-client policy; do not mix casually |
| Families | Separate thinking for IPv4, VPNv4, EVPN—activation and scale differ |
| Next-hop | IGP (or underlay BGP) must reach BGP next-hops after failure |

Reflection can be **suboptimal**: clients may prefer a path via the RR’s view rather than the true hot-potato exit. That is a design trade-off, not a bug—document intended exits with local-pref / communities.

## RR vs confederation vs full mesh

| Approach | When | Cost |
|---|---|---|
| Full mesh | Tiny AS (few routers) | Session sprawl at growth |
| Route reflector | Default enterprise / SP scale | Cluster design, suboptimal risk |
| Hierarchical RR | Very large, multi-region | More control hops, harder TE mental model |
| Confederation | Need sub-AS policy boundaries | Heavier ops, AS_PATH inside “one” ASN |

Confederations split one public AS into member ASes so eBGP-like policy applies between them while the outside still sees one ASN. Use when RR hierarchy alone cannot express the **policy wall** you need (e.g. legacy M&A domains that must stay semi-independent).

## Decision table — scale tool

| Pressure | Prefer |
|---|---|
| < ~10 iBGP speakers, stable | Full mesh OK |
| Dozens–hundreds of PEs / borders | Paired RRs |
| Multi-region + clear TE story | Hierarchical RR + communities |
| Strong internal policy walls, one external ASN | Confederation (last resort) |
| DC fabric with ASN-per-leaf | Often **eBGP**, not iBGP+RR |

## Real-world — SP / large enterprise MPLS PE farm

**Facts:** 120 PE routers, VPNv4/v6, dual POPs per region, need any-to-any + hub-spoke VRFs.

**Design:**

- Dual RR pairs per region (diverse buildings); inter-region RR hierarchy or mesh of RRs with clear cluster IDs
- RRs are dedicated (or core devices with **no** customer traffic dependency)
- RT import/export at PE; RR reflects VPN routes, does not invent topology
- Out-of-band or diverse management path if primary underlay dies

**Discarded:** One RR VM on the same hypervisor as half the PEs—control fate-share. Full mesh of 120 PEs—ops and CPU session tax.

## Real-world — mid-size enterprise Internet + WAN only

**Facts:** Four border routers, two DCs, iBGP for Internet + internal aggregates.

**Design:** Full mesh among four borders is fine; add RR only when PE/VRF or DC leaf count grows. Do not invent confederations for fashion.

## Design checklist

1. Is RR redundant and site-diverse (not just “two processes”)?
2. Are CLUSTER_ID / ORIGINATOR_ID understood by the team?
3. Which address families ride the same RR vs separate RR sets?
4. What happens to next-hop reachability if a core link dies?
5. Is suboptimal reflection acceptable, or do you need add-path / diverse paths?

## Risks

- Single RR cluster as SPOF for all VRFs / EVPN.
- RR on the only path to a next-hop (accidental data-plane dependency).
- Mixing RR clients across regions without TE communities → wrong exit.
- Confederation for a problem that communities + RR would solve.

## Interview framing

“I scale iBGP with paired, site-diverse RRs and treat the RR as control-plane only unless the design says otherwise. Confederations are a last resort for internal policy boundaries—not a default.”

## Related

- [When the enterprise needs BGP](03_When_Enterprise_Needs_BGP.md)
- [eBGP edge and policy](05_eBGP_Edge_and_Policy.md)
- [VPN topologies](../10_MPLS_VPN_and_EVPN/03_VPN_Topologies.md)
- [iBGP full mesh and RR (interview)](../../02_BGP/25_Interview_Questions/04_iBGP_Full_Mesh_and_RR.md)
- [BGP deep dive](../../02_BGP/BGP_Deep_Dive.md)

---
