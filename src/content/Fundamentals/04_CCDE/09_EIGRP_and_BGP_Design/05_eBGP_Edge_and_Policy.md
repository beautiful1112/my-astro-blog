# eBGP edge and policy

At the Internet or inter-AS edge, BGP **is** the product: what you accept, what you advertise, and how you prefer. Filters and max-prefix are not optional hygiene—they are the design.

```text
        ISP-A (ASN X)          ISP-B (ASN Y)
              |                      |
         CE/PE-A                  CE/PE-B
              \                    /
               Enterprise core / DMZ
         (never full Internet table in IGP)

Outbound: local-pref / communities / AS-path
Inbound:  prefix filters, RPKI, max-prefix
```

Dual ISP means **independent circuits, independent peering, independent failure domains**—not two NICs on one CPE upstreamed to the same provider POP.

## Policy building blocks

| Knob | Typical use |
|---|---|
| Prefix filter / IRR / origin validation | Accept only what you should |
| Max-prefix | Protect CPU/memory from peer mistakes |
| Local preference | Prefer exit for outbound |
| MED / AS-path prepend | Influence inbound (limited trust) |
| Communities | Signal to ISP (“prepend”, “no-export”, blackhole) |
| RPKI/ROA | Cryptographic origin check where deployed |

Pick a **story** for TE—do not stack every attribute until nobody can explain the preferred path.

## Default vs partial vs full table

| Table from ISP | When | Trade-off |
|---|---|---|
| Default only | Simple edge, one primary exit | Weak multi-exit TE |
| Partial (customer / regional) | Better exit choice without full load | Incomplete view |
| Full table | Serious multi-homing TE, large borders | Memory, CPU, ops skill |

This is an **RTO and TE** choice, not a macho metric. Many enterprises run default + selective more-specifics and are correct.

## Decision table — multihoming posture

| Requirement | Design move |
|---|---|
| Survive one ISP failure | Two ISPs, diverse last-mile and POPs |
| Prefer cheap / primary link | Local-pref outbound |
| Control inbound for a service | Announce more-specifics carefully + ISP communities |
| Must not transit | Filters + no-export / careful export policy |
| DDoS scrubbing | Provider/cloud scrub + routing announcement plan |

## Real-world — SaaS company dual-ISP edge

**Facts:** Active-active dual ISP, public `/24` for apps, need ~50 ms failover, full table on two borders, stateful firewalls.

**Design:**

- eBGP to each ISP on separate border routers
- Full tables on borders; IGP (or static/default) inside carries only defaults/aggregates toward campus
- Local-pref prefers ISP-A for most traffic; communities for backup
- Firewall HA with **symmetric** routing design (or asymmetric-aware state sync)—document the choice
- Max-prefix + prefix lists + RPKI where ISP supports it
- Explicit “we are not transit” export: only origin AS prefixes

**Discarded:** Two links to same ISP marketed as “multihome.” Redistributing full BGP into OSPF.

## Real-world — manufacturing plant (default-only)

**Facts:** One primary ISP, secondary LTE/backup, mostly outbound SaaS, low TE need.

**Design:** Default from primary; float static/default from backup with worse AD or BGP local-pref. No full table. Focus spend on firewall and DNS resilience.

## Design checklist

1. Are the two providers truly fate-independent?
2. What do we accept (filter + max-prefix + RPKI)?
3. What do we advertise (origin only—no accidental transit)?
4. Outbound preference story in one sentence?
5. Does next-hop / IGP for edge loopbacks survive a single link cut?
6. Firewall state vs asymmetric paths accounted for?

## Risks

- Accidental transit (missing export filters).
- Single CPE “HA pair” on one upstream called multihoming.
- Full table in IGP.
- Inbound TE with MED only, against providers that ignore MED.
- Blackhole community misuse or missing anti-DDoS playbook.

## Interview framing

“Edge BGP is filter, max-prefix, no accidental transit, and dual providers that do not share fate. The IGP gets a default or aggregates—not the Internet.”

## Related

- [When the enterprise needs BGP](03_When_Enterprise_Needs_BGP.md)
- [iBGP scale: RR and confederations](04_iBGP_Scale_RR_and_Confederations.md)
- [Internet edge and multihoming](../13_Campus_WAN_and_Edge/04_Internet_Edge_and_Multihoming.md)
- [Prefix filtering](../../02_BGP/11_Policy_and_Traffic_Engineering/02_Prefix_Filtering.md)
- [BGP threat model](../../02_BGP/16_Security_and_Hardening/01_BGP_Threat_Model.md)

---
