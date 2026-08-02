# Group-to-RP mapping methods

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

| Method | Benefit | Risk |
|---|---|---|
| Static RP | deterministic and simple | configuration/failover burden |
| PIM BSR | standards-based candidate BSR/RP distribution | control complexity and scope policy |
| Auto-RP | established Cisco-originated mechanism | vendor dependence and bootstrap considerations |
| Embedded RP | IPv6 RP encoded in group structure | specialized addressing constraints |

With BSR, candidate RPs advertise to the elected BSR; the BSR floods the RP set; routers independently choose a consistent RP using priority/hash logic.

