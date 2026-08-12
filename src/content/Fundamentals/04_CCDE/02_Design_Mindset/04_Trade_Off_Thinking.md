# Trade-off thinking

There is no globally best network. There is a **best fit** for this R/C/A. CCDE answers are comparisons, not trophies.

## Recurring axes

| Axis | Cheap direction | Expensive direction |
|---|---|---|
| Failure domain | Small, many modules | Large shared fate |
| Convergence | Fast local repair | Simpler, slower |
| Scale | Hierarchy, summary, controllers | Flat, full mesh, full LSDB |
| Cost | OPEX-heavy cloud / managed | CAPEX-heavy owned fiber |
| Operations | Few protocols, lots of automation | Many tools, heroics |
| Security | Strong segmentation | Any-to-any simplicity |
| Time-to-change | Agile, overlay, CI/CD | Long change windows, hardware |

Improving one axis usually taxes another. **State which axis you are spending.**

## Two-option habit

Always keep a runner-up:

```text
Option A: L3 access, OSPF, dual core
  + smaller L2 domain, summarizable
  - more IGP adjacencies, staff skill

Option B: L2 access, vPC, FHRP at dist
  + simpler access, fewer L3 hops
  - larger STP/vPC domain, stretch risk
```

Pick A **because** the requirement was “contain a loop to one closet,” not because L3 is fashionable.

## False trade-offs

- “Redundancy vs cost” without RTO: maybe a second cheap circuit beats a gold chassis.
- “Security vs usability” without stating the enforcement point: NAC can be phased (monitor → enforce).
- “On-prem vs cloud” without data-sovereignty and exit-cost constraints.

## Interview framing

“Every design spends something—blast radius, money, or operational complexity. I say what I am spending and what I am buying.”

---
