# Core CCDE terminology

Use these words the way a designer does. Vague synonyms hide bad designs.

| Term | Meaning in CCDE |
|---|---|
| **Requirement** | Outcome that must be true |
| **Constraint** | Limit you cannot freely remove |
| **Assumption** | Ungiven fact you are betting on |
| **HLD / LLD** | Architecture vs instance specification |
| **Failure domain** | Set of things that share fate on one fault |
| **Blast radius** | How far a fault or change propagates |
| **Fate sharing** | Hidden coupling (same fiber, same control node, same L2) |
| **Control / data / management plane** | Compute path / forward packets / operate the box |
| **Overlay / underlay / fabric** | Service topology / transport reachability / integrated forwarding system |
| **Policy point** | Where intent is enforced (RR, firewall, NAC, SD-WAN controller) |
| **Segmentation** | Isolation of reachability or trust (VRF, VLAN, SGT, zone) |
| **Modularity** | Ability to change or fail one part without redesigning all |
| **Summarization boundary** | Place where topology/prefix detail is hidden |
| **RTO / RPO** | Time to restore service / amount of data loss tolerated |
| **CAPEX / OPEX** | Buy now / pay to run |
| **Brownfield** | Existing network you must migrate, not a green lab |
| **Dual stack** | IPv4 and IPv6 as first-class, not an afterthought |

## Words to avoid as magic

- “Best practice” without the constraint it serves.
- “Highly available” without RTO and fate-share.
- “Scalable” without the scale axis (prefixes, sites, east-west, ops headcount).
- “Secure” without CIA + enforcement point.
- “Cloud” as a location rather than a **service and governance** model.

## Interview framing

“If I cannot say failure domain, policy point, and constraint in one breath, I do not yet have a design—I have a parts list.”

---
