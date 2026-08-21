# Internet edge and multihoming

Internet edge is **security + BGP policy + HA**. Multihoming means two providers and two paths that do not share fate—not an HA pair on a single upstream.

```text
Users/DC -- FW/edge pair -- Border-A -- ISP-A
                 |    \         
                 |     -- Border-B -- ISP-B
                 v
            DMZ / public services
```

Single “HA pair” on one upstream is just a nicer CPE.

## Design layers

| Layer | Concerns |
|---|---|
| Physical / circuit | Diverse fiber, POPs, last-mile providers |
| BGP | Filters, max-prefix, RPKI, TE story, no transit |
| Security | Firewall, IDS/IPS, DNS, reverse path, DDoS plan |
| Services | NAT, VIP, dual reverse DNS, certificate agility |
| Ops | Playbooks for ISP failure, scrubbing, policy rollback |

## Default vs partial vs full table

| Choice | Fits | Note |
|---|---|---|
| Default only | Simple outbound enterprise | Weak inbound TE |
| Partial | Better exit selection | Still incomplete |
| Full table | Strong TE, skilled borders | Memory/CPU/ops cost |

Tied to RTO and inbound/outbound control—not ego.

## Multihoming decision table

| Goal | Design move |
|---|---|
| Survive ISP failure | Two ISPs + diverse paths + tested failover |
| Prefer primary link | Local-pref outbound |
| Keep inbound sticky for apps | Careful more-specifics + DNS TTLs |
| Avoid transit | Strict export; only originated prefixes |
| Absorb DDoS | Provider/cloud scrubbing + routing announcement |
| Stateful FW + dual path | Symmetry design or asymmetric-capable HA |

## Real-world — dual-ISP e-commerce edge

**Facts:** Active-active public `/23`, PCI scope, dual firewalls, need < 1 min recovery, occasional volumetric DDoS.

**Design:**

- Border-A/B to ISP-A/B; eBGP with prefix filters + max-prefix + RPKI
- Announce `/23` plus selective `/24`s for TE; document withdraw plan
- Firewalls in HA with routing that keeps flows symmetric **or** state sync proven under fail
- Cloud scrubbing on-demand; blackhole community with ISP as last resort
- Internal routing: defaults/aggregates only—no full table in campus IGP
- Runbooks: ISP down, scrub activate, rollback

**Discarded:** Two circuits to same ISP POP labeled “redundant Internet.”

## Real-world — branch-heavy retail (hub Internet)

**Facts:** Branches use SD-WAN; Internet breakout at regional hubs; one backup DIA.

**Design:** Multihome **hubs**, not every branch. Branches get local DIA only if policy/compliance allows and security stack is replicated. Centralize inspection where identity and DLP require it; allow trusted local breakout for SaaS when designed.

## Security and asymmetry

| Risk | Mitigation |
|---|---|
| Asymmetric paths drop stateful sessions | Design symmetry, or HA that tolerates asymmetry |
| DNS points to dead VIP | Health checks + short TTL + anycast carefully |
| Accidental transit | Export filters reviewed like code |
| On-prem scrub only | Know capacity limits; contract cloud scrub |

## Design checklist

1. Are ISPs and last-miles fate-independent?
2. What table do we take and why?
3. Export policy: origin only?
4. Firewall state vs dual path tested?
5. DDoS: detect → announce → scrub → restore steps owned by whom?
6. Does campus IGP stay free of Internet routes?

## Risks

- Calling single-ISP dual-link “multihoming.”
- Full BGP table in IGP.
- NAT and DNS as afterthoughts during failover.
- Unlimited trust of ISP communities without documentation.

## Interview framing

“Multihoming is two providers, two paths, and BGP policy that will not transit. An HA pair on one ISP is just a nicer CPE—and the Internet never enters the campus IGP.”

## Related

- [eBGP edge and policy](../09_EIGRP_and_BGP_Design/05_eBGP_Edge_and_Policy.md)
- [Cloud OnRamp](05_Cloud_OnRamp.md)
- [SD-WAN design](03_SD_WAN_Design.md)
- [Segmentation](../16_Security_Design/02_Segmentation.md)
- [BGP policy and TE](../../02_BGP/11_Policy_and_Traffic_Engineering/02_Prefix_Filtering.md)

---
