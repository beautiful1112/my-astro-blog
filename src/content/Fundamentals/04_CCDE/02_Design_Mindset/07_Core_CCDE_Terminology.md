# Core CCDE terminology

Shared vocabulary keeps defenses short and precise. Use these terms the way graders and architecture boards expect.

## Business and method

| Term | Meaning in CCDE |
|---|---|
| Requirement (R) | Outcome that must be true |
| Constraint (C) | Limit you cannot freely remove |
| Assumption (A) | Ungiven bet; must be listed and tested |
| Trade-off | What you buy vs what you spend |
| HLD / LLD | Architecture invariants vs build details |
| Migration | Phased path from brownfield with rollback |

## Planes and paths

| Term | Meaning |
|---|---|
| Control plane | Computes reachability / policy state |
| Data plane | Forwards packets/frames |
| Management plane | Config, telemetry, AAA access to devices |
| Policy / orchestration | Intent and controllers when present |
| Underlay / overlay | Transport reachability vs service tunnels |
| Seam | Planned boundary (IGP↔BGP, VRF, FW) |

```text
User traffic → data plane
Routing/VPN signaling → control plane
SSH/API/telemetry → management plane
Controller intent → policy/orchestration
```

## Failure and scale

| Term | Meaning |
|---|---|
| Failure domain | Set that shares fate for a class of faults |
| Blast radius | How far a fault’s impact reaches |
| Fate sharing | Hidden coupling (power, STP, RR, fiber) |
| RTO / RPO | Time to recover / data-loss tolerance |
| Summarization | Hide detail to bound control-plane scope |
| Hierarchy | Modular tiers that enable summary and policy |

## Security and ops

| Term | Meaning |
|---|---|
| Segmentation | Limit who can talk to whom |
| PEP | Policy enforcement point |
| Trust boundary | Where assurance level changes |
| Observability | Ability to see user/app truth, not only links |

## Real-world — onboarding a new architect

**Brief:** Team talks past each other—“resilient” means dual chassis to one person and diverse buildings to another.

| R / C / A | Statement |
|---|---|
| R | Shared glossary for ARB packs within one quarter |
| C | Mixed CCIE and enterprise architects |
| A | “Everyone knows these words” — false |

**Practice:** Every design pack must use R/C/A, name failure domains, and state underlay vs overlay. Reject slides that only say “highly available.”

## Mini drill

Replace vague phrases:

| Vague | Precise |
|---|---|
| Highly available | Dual PE, diverse metro, RTO 60 s for class X |
| Scalable | Bounded LSDB; summaries at area border |
| Secure | PCI VRF + FW PEP; no east-west default |
| Cloud-ready | On-ramp pattern; no sovereignty violation |

## Risks

- Using vendor marketing words instead of these terms.
- Mixing control and data plane in diagrams.
- Calling every limit a “requirement.”

## Interview framing

“I use R/C/A, planes, failure domains, and seams so the defense stays unambiguous under time pressure.”

## Related

- [R/C/A](03_Requirements_Constraints_Assumptions.md)
- [Control, data, management planes](../04_Planes_and_Traffic_Flow/01_Control_Data_Management_Planes.md)
- [Failure domains](../15_High_Availability_and_Scale/01_Failure_Domains.md)

---
