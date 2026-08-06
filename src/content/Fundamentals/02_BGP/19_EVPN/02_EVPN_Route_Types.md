# EVPN Route Types

Frequently used EVPN route types are:

| Type | Name | Main purpose |
|---|---|---|
| 1 | Ethernet Auto-Discovery | Multi-homing discovery, aliasing, mass withdrawal |
| 2 | MAC/IP Advertisement | Advertise MAC and optional IP binding |
| 3 | Inclusive Multicast Ethernet Tag | Build broadcast, unknown-unicast, and multicast delivery |
| 4 | Ethernet Segment | Discover PEs sharing an Ethernet segment and elect DF |
| 5 | IP Prefix | Advertise IP prefixes independently of a MAC |

Route behavior depends on RD, RT, ESI, Ethernet Tag, label or VNI, next hop, and extended communities—not only the route type number.

---

