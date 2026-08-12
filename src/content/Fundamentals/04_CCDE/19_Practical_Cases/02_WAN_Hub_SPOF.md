# Case: WAN hub as single point of failure

## Symptom

All branches died when the hub DC lost power. Spokes were not stubbed; the second “hub” was a VM on the same SAN.

## R/C/A

- R: branches survive DC-A for 4 hours (SaaS + voice)
- C: Internet available at most sites; budget for one more VM is not diversity
- A: “HA pair” meant two routers, not two sites

## Options

| A | Dual independent hubs + spoke stub + DIA for SaaS |
| B | Bigger UPS at DC-A |

**Pick A.** B does not meet a site-loss RTO. Add LTE/DIA where voice RTO is tighter.

## Lesson

Hub fate is a site and power domain. Stub spokes so they do not depend on being transit through a corpse.

---
