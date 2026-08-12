# EIGRP as enterprise IGP

EIGRP is a strong **Cisco-centric enterprise** IGP: fast local repair with feasible successors, simple hub-spoke with stubs, unequal-cost via variance when you really mean it.

Use it when:

- Installed base and staff are Cisco IOS/XE
- WAN is hub-spoke / DMVPN and query bounding is understood
- You want one IGP for campus+WAN without area 0 politics

Avoid it as the **multi-vendor core** or as a place to dump Internet BGP.

Design comparison with OSPF: EIGRP hides topology (DV); OSPF shows links in an area. EIGRP’s danger is **unbounded queries**; OSPF’s is **LSDB/SPF size**. Different tools, same need for hierarchy.

Deep dive: [EIGRP library](../../03_EIGRP/EIGRP_Deep_Dive.md).

## Interview framing

“EIGRP is my Cisco enterprise IGP when I can stub and summarize. I do not use it as a multi-vendor or Internet protocol.”

---
