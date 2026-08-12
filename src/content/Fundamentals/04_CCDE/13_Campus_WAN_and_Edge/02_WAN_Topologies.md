# WAN topologies

WAN is where **cost, RTO, and hub fate** show up first.

| Pattern | Use | Watch |
|---|---|---|
| Dual hub MPLS | Predictable SLA | Cost; still need Internet/SaaS story |
| DMVPN | Internet transport + IPsec | Hub scale, NHRP, IGP stub |
| SD-WAN | App SLA, DIA, central policy | Underlay diversity, controller HA |
| Internet only | Cheap | QoS and RTO honesty |
| Hybrid | MPLS for voice, DIA for SaaS | Policy which app uses which |

Physical diversity: two circuits on one entrance is not two paths. Confirm conduit, POP, and provider.

## Interview framing

“WAN topology follows traffic and RTO. Dual hubs, diverse underlay, and an honest SaaS path beat a single gold MPLS star.”

---
