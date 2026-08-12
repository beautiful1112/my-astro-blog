# Cloud OnRamp

Cloud connectivity is a **service placement** problem: Direct Connect / ExpressRoute / dedicated, IPsec, SD-WAN Cloud OnRamp, or Internet SaaS.

| Path | Strength | Weakness |
|---|---|---|
| Dedicated interconnect | SLA, private | Region pinning, cost, lead time |
| IPsec to VGW/NGFW | Fast to deploy | MTU, ops, scale |
| SD-WAN on-ramp | App-aware, many sites | Vendor and region coverage |
| Native Internet to SaaS | Simple | Little control, sovereignty |

Pin **region** to sovereignty. Do not on-ramp EU users to a US hub “because the template did.”

See [cloud hybrid](../14_Data_Center_and_Cloud/04_Cloud_Hybrid_Placement.md).

## Interview framing

“On-ramp is how sites reach a specific cloud region under a residency and SLA constraint—not a generic tunnel to ‘the cloud.’”

---
