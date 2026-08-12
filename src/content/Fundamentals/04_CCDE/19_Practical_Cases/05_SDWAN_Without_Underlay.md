# Case: SD-WAN overlay without underlay

## Symptom

SD-WAN deployed on a single Internet circuit per site. Controller in one public region. Circuit brownout: apps flap. Controller unreachable: no new sites, and some policies fail-closed.

## R/C/A

- R: 30 s recover for voice
- C: cost pressure vs MPLS
- A: “SD-WAN provides HA by itself”

## Options

| A | Second underlay (LTE/DIA2) + controller cluster + last-known-forward |
| B | QoS on the single circuit |

**Pick A** for the RTO. B helps mice vs elephants, not a cut fiber.

## Lesson

Overlay policy cannot invent a second photon. Design underlay diversity and controller fate explicitly.

---
