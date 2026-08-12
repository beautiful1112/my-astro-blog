# Dual-stack design

Dual stack means **two first-class designs**: IGP/BGP, security, QoS, multicast, and Internet edge for v4 and v6.

Traps:

- v6 allowed on the LAN but blocked on the FW → Happy Eyeballs surprise
- Unique v6 path around inspection
- Forgetting ND/RA security while obsessing over v4 DHCP snooping
- One IPv4 default and no IPv6 default (or the reverse)

CCDE Written expects you not to “forget v6” in HLD.

## Interview framing

“Dual stack is two complete policies. If v6 bypasses the firewall the design is wrong, even if v4 is perfect.”

---
