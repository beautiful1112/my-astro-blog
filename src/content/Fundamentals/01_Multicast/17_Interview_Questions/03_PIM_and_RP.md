# Interview questions: PIM and RP

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

**Why “protocol independent”?** PIM consumes an MRIB supplied by another routing system.

**Describe PIM-SM registration.** FHR encapsulates initial data in Registers to the RP; RP decapsulates, forwards on RPT, joins toward source, then sends Register-Stop.

**Why switch to SPT?** Reduce path stretch and latency and avoid steady-state traffic through the RP.

**Is RP always in the data path?** Initially for ASM; established SPT traffic can bypass it.

**Why no RP for SSM?** Receiver already knows `S`, so joins go directly toward it.

**DR versus Assert winner?** DR acts for connected hosts; Assert selects one forwarder for a flow on a shared LAN.

**What does MSDP do?** Shares active IPv4 ASM source information between RPs; it does not carry user data.

**What does MBGP do?** Supplies multicast-specific RPF reachability; PIM still builds trees.

