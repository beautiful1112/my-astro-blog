# Multicast security threats

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

- unauthorized receiver joins and data leakage;
- unauthorized ASM source injection;
- spoofed source addresses undermining SSM;
- forged IGMP/MLD state or querier takeover;
- forged PIM Hellos, Joins/Prunes, Registers, or Register-Stops;
- RP/BSR/MSDP poisoning;
- amplification through large replication fan-out;
- TCAM/MFIB/filter/control-CPU exhaustion;
- cross-tenant leakage from VLAN/VRF/overlay errors.

Multicast optimizes delivery; it does not provide confidentiality or authenticity.

