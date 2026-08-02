# Common multicast misconceptions

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

| Misconception | Correction |
|---|---|
| Sender joins to send | Join controls reception. |
| IGMP routes multicast | IGMP reports local listeners; PIM builds routed trees. |
| Snooping blocks multicast | It constrains replication; bad state can black-hole traffic. |
| PIM neighbor up proves service | RPF, RP/source state, OIL, policy, hardware, and data must also work. |
| RP failure always stops data | Existing SPT flows may continue while new flows fail. |
| SSM is only an address range | It is a source-aware `(S,G)` service model. |
| Two groups equal redundancy | Only independent end-to-end paths plus arbitration provide resilience. |
| No switch drops means no loss | NIC, driver, kernel, socket, bypass stack, and application can drop. |
| More buffering solves loss | It can convert loss into stale-data latency. |
| TTL secures scope | TTL is a hop bound; use boundaries and policy. |

