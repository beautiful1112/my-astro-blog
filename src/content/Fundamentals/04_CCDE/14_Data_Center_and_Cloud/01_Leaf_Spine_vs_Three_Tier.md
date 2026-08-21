# Leaf-spine versus three-tier

Classic DC: access–aggregation–core, often oversubscribed **north-south**. Modern apps are **east-west**. Leaf-spine (CLOS) gives predictable bandwidth and ECMP when that traffic pattern dominates.

```text
Three-tier (N-S bias):          Leaf-spine (E-W scale):

      Core                         S1   S2   S3
       |                            | \ / \ / |
   Aggregation                     L1  L2  L3  L4
       |                           |    |    |
     Access                      servers / border / storage
```

Oversubscription is a **stated ratio**, not an accident. AI/HPC may need nonblocking fabrics or a second fabric (storage vs compute).

## Comparison

| Dimension | Three-tier | Leaf-spine |
|---|---|---|
| Traffic assumption | Mostly in/out of DC | Heavy server-to-server |
| Bandwidth plan | Tier oversubscription common | ECMP; plan leaf↔spine capacity |
| Scale-out | Forklift aggregation/core | Add leaf; add spine when uplink-bound |
| L2 historically | STP domains, MCLAG complexity | Often L3 underlay + overlay |
| Ops familiarity | Brownfield comfort | Needs ECMP / fabric discipline |
| Small DC | Often cheaper / enough | Can be overkill |

## When three-tier still wins

| Signal | Prefer three-tier (or keep it) |
|---|---|
| Small room, few racks, N-S apps | Yes |
| Brownfield with stable traffic | Evolve gradually |
| Budget / skills not ready for fabric | Do not force CLOS fashion |
| Appliance-centric (few east-west flows) | Hierarchical may fit |

Do not force a 4-spine CLOS on a 6-rack room without a requirement.

## Decision table

| Requirement | Prefer |
|---|---|
| East-west scale, many racks | Leaf-spine |
| Stated 1:1 or low oversubscription | Leaf-spine with math |
| AI training clusters | Specialized rail / nonblocking design |
| Legacy 3-tier, no pain | Keep; overlay only if needed |
| Dual fabric (storage + IP) | Explicit—do not merge blindly |

## Real-world — SaaS DC growth

**Facts:** 20 → 80 racks in 18 months, microservices, storage on IP, dual site.

**Design:**

- Leaf-spine with N spines sized for leaf uplinks; ECMP underlay (eBGP or IGP)
- VXLAN EVPN overlay for tenancy; L3 between sites
- Oversubscription target documented (e.g. 2:1 leaf-to-spine worst case)—revisit quarterly
- Border leaves for WAN/Internet/firewall

**Discarded:** Scaling aggregation tier with ever-larger chassis and STP between PODs.

## Real-world — corporate DC (keep hierarchy)

**Facts:** 8 racks, mostly VDI and app tiers north-south to campus, low east-west.

**Design:** Keep access/agg/core or collapsed; invest in better monitoring and firewall HA. Re-evaluate if Kubernetes east-west explodes.

## Design checklist

1. What fraction of traffic is east-west under peak?
2. What oversubscription ratio is contracted with the business?
3. How do we add capacity—buy leaf, buy spine, or forklift?
4. Is L2 confined to leaf pairs / VNIs, or still spanning tiers?
5. Failure: spine loss vs aggregation loss—blast radius?

## Risks

- Leaf-spine diagram with hidden L2 loops at the edge.
- Unstated oversubscription that fails during backup storms.
- One giant firewall hairpin defeating fabric bandwidth.
- AI/storage traffic on a general-purpose fabric without isolation.

## Interview framing

“Leaf-spine is for east-west scale with ECMP and a stated oversubscription ratio. I keep three-tier only when north-south and size make it the cheaper, operable module.”

## Related

- [VXLAN EVPN data center](02_VXLAN_EVPN_DC.md)
- [DCI patterns](03_DCI_Patterns.md)
- [AI fabric design notes](05_AI_Fabric_Design_Notes.md)
- [Scale limits and modularity](../15_High_Availability_and_Scale/05_Scale_Limits_and_Modularity.md)
- [EVPN as unified control](../10_MPLS_VPN_and_EVPN/04_EVPN_as_Unified_Control.md)

---
