# Waterfall versus Agile

Project method is a **design constraint**. It changes batch size, rollback, and how much HLD must be frozen.

## Impact on network design

| | Waterfall-like | Agile / iterative |
|---|---|---|
| HLD | Freeze early, big-bang build | Thin HLD, evolve modules |
| Risk | Late integration surprise | Continuous integration of network-as-code |
| Change | Rare, large windows | Small, reversible changes |
| Good for | Regulated cutovers, optical, DC moves | Overlay policy, SD-WAN apps, CI/CD |
| Design need | Detailed LLD and test plan up front | Automation, observability, feature flags |

Neither is “more CCDE.” A nuclear plant WAN and a SaaS campus should not use the same change culture.

## Design moves

- If the customer is Agile but the underlay is a 9-month fiber build, **split the design**: underlay waterfall, overlay agile.
- If they demand weekly app changes on a network with no source of truth, the missing piece is **automation and a controller/policy model**, not another protocol.
- Waterfall does not excuse skipping failure-domain thinking; it just front-loads the LLD.

## Interview framing

“I treat Waterfall vs Agile as a constraint on how big a change can be. I put slow physics (fiber, hardware) in a planned track and fast intent (policy, overlay) in an automated track.”

---
