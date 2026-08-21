# Multicast design choices

Unicast cloning at the source does not scale. Multicast is a **replication and RPF** design: who builds trees, where state lives, and whether the WAN can honor reverse-path rules.

```text
Source -- first-hop -- (shared / source tree) -- last-hop -- receivers
              ^ RPF check toward source (or RP for shared tree)
```

Do not enable PIM “in case.” Overlay multicast (or app-level fanout) may be better across a WAN that cannot guarantee RPF.

## Mode selection

| Choice | When | Design burden |
|---|---|---|
| **SSM** | Source known (market data, many modern apps, some IPTV) | IGMPv3/MLDv2; no RP |
| **ASM** | Dynamic/unknown sources, legacy | RP, mapping, SPT switchover |
| **Bidir** | Many-to-many, avoid per-source state explosion | DF election, RP (rendezvous) |
| **No native multicast** | App can unicast or overlay; WAN cannot support RPF | App fanout, GRE/SD-WAN, cloud relay |

## ASM vs SSM vs Bidir (decision cues)

| Signal | Prefer |
|---|---|
| Fixed, well-known sources | SSM |
| Receivers discover sources dynamically | ASM (+ solid RP design) |
| Many sources, many receivers, same group | Bidir |
| Cloud / Internet path in the middle | Often no native multicast |
| Finance market data | Usually SSM; capacity math first |

## Scope and domain boundaries

| Scope | Typical approach |
|---|---|
| Single campus / DC | PIM in underlay or fabric multicast features |
| Multi-site L3VPN | MDT / NG-MVPN / profile choice—do not invent ad hoc |
| SD-WAN | Check vendor multicast support; often constrained |
| EVPN/VXLAN | Separate BUM vs IP multicast design |

Every domain boundary is an RPF and TTL opportunity for failure.

## Real-world — exchange market-data plant

**Facts:** Multiple feeds, known sources, receivers on several VLANs, strict loss budget, leaf-spine DC.

**Design:**

- SSM only; document (S,G) inventory
- PIM-SM/SSM on underlay or fabric multicast; IGMP snooping at L2 edge
- No ASM “for flexibility”—removes RP as SPOF class
- Capacity: fanout × packet rate sized on spines/leaves
- WAN to DR site: either SSM across DCI with careful RPF **or** re-source locally (often better)

**Discarded:** ASM with Anycast-RP “because we might add sources”—ops complexity without need.

## Real-world — enterprise IPTV + campus wireless

**Facts:** Live TV to conference rooms, wireless clients, WAN to branches that cannot multicast.

**Design:** ASM or SSM on campus only; local breakout / unicast gateway for branches; QoS for video class; snooping + Querier placement. Do not flood wireless with indiscriminate multicast—use controller/AP multicast-to-unicast where required.

## Decision table — enable multicast?

| Question | If no → |
|---|---|
| Can every hop honor RPF for the chosen tree? | Unicast or overlay |
| Is source set known and stable? | Prefer SSM; else ASM/Bidir story |
| Is BUM/multicast scale within platform limits? | Split domains / rate-limit |
| Does the app own retransmission? | Design loss class + monitoring |

## Design checklist

1. SSM, ASM, or Bidir—and why?
2. Where does IGMP/MLD querier and snooping live?
3. RP placement (if any): Anycast? MSDP? BSR?
4. TTL scoping and boundary filters at campus/DC/WAN edges?
5. What is the failure mode when RPF breaks after a routing change?

## Risks

- PIM everywhere with no receiver interest → state and CPU waste.
- Multicast across asymmetric WAN without RPF plan.
- Wireless treating multicast like wired flood.
- Forgetting that QoS and multicast interact (replication amplifies congestion).

## Interview framing

“I pick SSM when sources are known, ASM/Bidir only with an RP story, and I refuse multicast across a WAN that cannot honor RPF—overlay or app fanout is a valid design.”

## Related

- [RP placement](02_RP_Placement.md)
- [QoS as a design problem](03_QoS_as_a_Design_Problem.md)
- [Multicast deep dive](../../01_Multicast/Multicast_Deep_Dive.md)
- [Market data architecture](../../01_Multicast/12_Quant_Trading_Market_Data/02_Typical_Feed_Architecture.md)

---
