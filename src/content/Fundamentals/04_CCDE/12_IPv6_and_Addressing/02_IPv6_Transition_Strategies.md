# IPv6 transition strategies

| Strategy | Idea | Risk |
|---|---|---|
| Dual stack | Both on the host/network | Two policies to maintain (the honest cost) |
| Tunnel | 6in4, DMVPN, SD-WAN | MTU, overlay ops |
| Translation | NAT64/DNS64, SLB | App breakage, state, logging |
| IPv6-only + overlay | Modern DC/mobile | Brownfield apps |

There is no free transition. Dual stack is the usual enterprise **requirement** for CCDE-style designs unless the scenario forbids it. Translation is for *islands*, not a silent core strategy.

## Interview framing

“I default to dual stack with a real v6 plan. Tunnels and NAT64 are island tools, not an excuse to skip addressing.”

---
