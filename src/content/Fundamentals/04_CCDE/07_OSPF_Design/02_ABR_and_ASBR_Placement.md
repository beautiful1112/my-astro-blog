# ABR and ASBR placement

**ABR** sits on area 0 plus at least one other area and is the **summary and type-3** control point. **ASBR** injects external (type-5/7) state. Placement is where you decide what topology is **hidden** and what instability is **imported**.

## Roles at a glance

| Role | Attaches | Controls |
|---|---|---|
| **ABR** | Area 0 + non-backbone area(s) | Type-3/4 summaries, inter-area distance |
| **ASBR** | OSPF + external domain | Type-5 (or type-7 in NSSA) |
| Both on one box | Possible | High blast radius—use deliberately |

```text
Area 10 (campus) -- ABR pair -- Area 0 (DC/WAN hubs) -- ABR pair -- Area 20
                                      |
                                   ASBR pair (BGP/Internet/cloud)
                                      |
                              External prefixes (bounded!)
```

## Placement rules

- Put ABRs where you **intend to summarize** (campus/WAN/DC edge), in **pairs** for HA.
- Too many ABRs in one area: more type-3s and more ways to be inconsistent.
- ASBRs belong at a **deliberate seam** (Internet, BGP, redistribution)—not on every distribution switch.
- Prefer dual ABRs with consistent summary config; asymmetric summaries create asymmetric routing and hairpins.

```text
Bad:  every dist is ASBR redistributing BGP
Good: two DC borders are ASBRs; campuses take a default or a few aggregates
```

Internet edge as OSPF ASBR advertising thousands of BGP prefixes into the IGP is a classic failure. Keep BGP at the edge; inject a default or limited aggregates.

## ABR count and topology

| Pattern | Effect |
|---|---|
| One ABR per large area | SPOF for inter-area; maintenance pain |
| Dual ABR, same summaries | HA; still one logical policy |
| Many ABRs, messy masks | Type-3 explosion; hard to reason |
| ABR not on area 0 path | Virtual link debt—fix topology instead |

## Real-world — healthcare multi-campus OSPF

**Facts:** Three hospitals + dual DC; regional address blocks already exist; radiology and EHR have strict RTO.

| R / C / A | Statement |
|---|---|
| R | WAN flap in Hospital C must not SPF every DC leaf |
| R | Inter-campus summary hides building-level churn |
| C | Dual ABR per campus mandatory (no single chassis) |
| A | Summaries leave no covering holes — verify before Null0 |

```text
Hosp-A area 10 --+
Hosp-B area 20 --+-- dual ABR -- Area 0 (DC-A/DC-B + WAN)
Hosp-C area 30 --+                 |
                                ASBR (BGP to partners) injects default only
```

**Design:** ABRs at campus edge summarize `10.x.0.0/16`; ASBR at DC edge injects **default** (or partner aggregates), never full partner BGP table. Residual: suboptimal inter-area paths via area 0—accepted vs blast-radius win.

## Real-world — retail HQ “ASBR on every WAN router”

**Smell:** Each regional WAN router redistributes DMVPN BGP into OSPF so branches are “visible.”

**Result:** Branch flap → type-5 churn domain-wide; SPF/CPU on campus cores; one bad redistribute duplicates prefixes with different metrics.

| Fix | Action |
|---|---|
| Collapse ASBRs | Two hub ASBRs only |
| Bound injection | Defaults + regional aggregates |
| Move policy | Keep branch specifics in BGP |

## Summarization and ASBR interaction

ABRs hide **topology**; ASBRs import **external reachability**. If ASBRs inject specifics that punch holes in ABR summaries, you get surprising exit choices. Design aggregates so external and inter-area stories do not fight.

## Design checklist

1. Can each area reach area 0 via dual ABRs?
2. Do ABR summaries match the address plan (no silent holes)?
3. How many ASBRs exist, and what exact prefixes do they inject?
4. Is BGP Internet/cloud state kept out of the LSDB?
5. Are ABR/ASBR configs identical enough across the HA pair?

## Risks

- Single ABR for a large campus area.
- ASBR role on every distribution layer-3 switch.
- Advertising full BGP into OSPF.
- Inconsistent dual-ABR summaries → asymmetric traffic and hard breaks.
- Combining ABR+ASBR on one underpowered box at a noisy edge.

## Interview framing

“ABRs are where I hide topology. ASBRs are rare seams. I do not sprinkle either role on every box.”

## Related

- [OSPF area design](01_OSPF_Area_Design.md)
- [Stub and NSSA as design tools](03_Stub_NSSA_as_Design_Tools.md)
- [Summarization and suboptimal routing](04_Summarization_and_Suboptimal_Routing.md)
- [Redistribution as a design smell](../06_Routing_Protocol_Selection/03_Redistribution_as_a_Design_Smell.md)

---
