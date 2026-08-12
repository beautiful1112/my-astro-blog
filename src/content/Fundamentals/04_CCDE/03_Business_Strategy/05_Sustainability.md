# Environmental sustainability

CCDE v3.1 lists environmental sustainability as a business-strategy topic. Treat it as a **constraint and cost**, not marketing.

## Where the network spends energy

- Over-provisioned always-on chassis and unused line cards
- Poorly utilized DC cooling and low-efficiency PSUs
- Hairpinning traffic through distant DCs (extra WAN + extra silicon)
- Keeping three generations of hardware “just in case” without a retirement plan

## Design moves that actually help

| Move | Why it can reduce impact |
|---|---|
| Right-size and power-off unused capacity | Less draw and cooling |
| Collapse unnecessary tiers | Fewer boxes in the path |
| Local breakout / edge compute | Less long-haul traffic |
| Higher utilization with QoS, not 5% busy cores | Fewer devices for the same work |
| Refresh for efficiency **and** supportability | Old gear can be both hot and risky |
| Cloud only when it reduces *total* energy/waste, not when it hides it | Scope 2/3 still exists |

Do not claim “cloud is green” without the workload and region story. Do not disable HA to save watts if RTO forbids it—state the trade-off.

## Interview framing

“Sustainability in design is utilization, right-sizing, and avoiding pointless hairpins—subject to the same RTO and safety constraints as any other cost.”

---
