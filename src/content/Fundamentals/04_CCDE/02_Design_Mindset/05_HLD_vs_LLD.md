# HLD versus LLD

**High-level design (HLD)** answers *what the system is*: modules, planes, major protocols, HA story, trust boundaries, and how it meets business outcomes. **Low-level design (LLD)** answers *how this instance is specified*: IDs, timers, QoS maps, IP plans, platform features.

CCDE Written is explicitly HLD-heavy. Practical still rewards HLD first; LLD appears when options differ in operable detail.

## What belongs where

| HLD | LLD |
|---|---|
| Hierarchical campus, L3 to access | Area 10 = bldg A, summary 10.10.0.0/16 |
| Dual-homed SD-WAN + DIA breakout | Color, TLOC, app-route SLA numbers |
| EVPN-VXLAN leaf-spine, no L2 DCI | VNI, RT import/export, MTU 9216 |
| PCI VRF + firewall sandwich | Zone names, specific inspect policy |
| RTO 15 min for branch | BFD 300×3, HSRP msec, circuit diversity |

If an HLD document is full of interface names and no failure domains, it is an LLD pretending to be strategy. If an LLD has no addressing or QoS map, it is a slide.

## Exam implication

When a Written item asks “which design,” prefer the option that matches **stated business and operational constraints** even if another option has more features. Feature lists are LLD bait.

When Practical asks you to refine, add only the LLD that **discriminates** options (for example, whether summarization is possible with the given address plan).

## Interview framing

“HLD is the architecture I can defend to a CIO and a NOC. LLD is the contract I hand to implementers. I do not mix them until the HLD is stable.”

---
