# IGMP and MLD message-destination matrix

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## IPv4 IGMP

| Version/message | Network-layer destination | Group inside message |
|---|---|---|
| v1 General Query | 224.0.0.1 | 0.0.0.0 |
| v1 Report | G | G |
| v2 General Query | 224.0.0.1 | 0.0.0.0 |
| v2 Group-Specific Query | G | G |
| v2 Report | G | G |
| v2 Leave | 224.0.0.2 | G |
| v3 General Query | 224.0.0.1 | 0.0.0.0 |
| v3 Group/Source Query | G | G |
| v3 Report | 224.0.0.22 | Per Group Record |

## IPv6 MLD

| Version/message | Network-layer destination | Group inside message |
|---|---|---|
| v1 General Query | ff02::1 | :: |
| v1 Address-Specific Query | G | G |
| v1 Report | G | G |
| v1 Done | ff02::2 | G |
| v2 General Query | ff02::1 | :: |
| v2 Address/Source Query | G | G |
| v2 Report | ff02::16 | Per Address Record |

## Why this matters

Packet filters that admit only the application group can block:

- IGMPv2 Leave to 224.0.0.2.
- IGMPv3 Report to 224.0.0.22.
- MLDv1 Done to ff02::2.
- MLDv2 Report to ff02::16.

A snooping implementation also uses these destinations to identify router-facing and listener-facing control traffic. Validate both IP and Ethernet destination mapping.

## General Query response rule

The query destination is not automatically the response destination:

- An IGMPv2 General Query is sent to **224.0.0.1** with Group Address **0.0.0.0**.
- A host responds with one type-0x16 Membership Report per joined group.
- Each report's IPv4 destination and IGMP Group Address are both **G**.
- The response is not unicast to the router and is not sent to 224.0.0.1.

For comparison, IGMPv3 Reports are containers for multiple Group Records and therefore use the common router destination **224.0.0.22**.
