# L3VPN versus L2VPN

| | L3VPN | L2VPN / VPLS / EVPN-ELAN |
|---|---|---|
| CE-PE | Routing (eBGP/OSPF/static) | Bridging or VLAN handoff |
| Failure domain | IP/VRF | L2 may stretch |
| Scale | Excellent with RT/RD | Flood/MAC must be designed |
| Customer want | “Just give me IP” | “My VLAN/LAN anywhere” |

Default to **L3VPN** unless the requirement is true L2 adjacency. EVPN can do both with better control than classic VPLS, but L2 fate still exists if you stretch broadcast domains.

## Interview framing

“I sell L3VPN by default. I sell L2/EVPN-ELAN only when the application truly needs a broadcast domain, and I bound that domain.”

---
