# Interview questions: PIM and RP

**Why “protocol independent”?** PIM consumes an MRIB supplied by another routing system.

**Describe PIM-SM registration.** FHR encapsulates initial data in Registers to the RP; RP decapsulates, forwards on RPT, joins toward source, then sends Register-Stop.

**Why switch to SPT?** Reduce path stretch and latency and avoid steady-state traffic through the RP.

**Is RP always in the data path?** Initially for ASM; established SPT traffic can bypass it.

**Why no RP for SSM?** Receiver already knows `S`, so joins go directly toward it.

**DR versus Assert winner?** DR acts for connected hosts; Assert selects one forwarder for a flow on a shared LAN.

**What does MSDP do?** Shares active IPv4 ASM source information between RPs; it does not carry continuing user data.

**What does MBGP do?** Supplies multicast-specific RPF reachability; PIM still builds trees.

**Describe all PIM-SM ASM phases.** Receiver builds `(*,G)` RPT toward RP; FHR Registers source; RP joins `(S,G)` and stops Registers after native data; LHR may join source, set SPT bit, and send `(S,G,rpt)` Prune.

**What is a Null-Register?** A source-DR probe containing the inner IP header without payload. It tests whether the RP still wants full Registers suppressed.

**Is Register-Stop an error?** Usually not. It is the normal signal to suppress encapsulation once the RP has native traffic or has no interested receivers/policy rejects the flow.

**What does the SPT bit prove?** The router has completed the forwarding transition and accepts the source-tree path; `(S,G)` state alone does not prove that.

**What is `(S,G,rpt)`?** Negative per-source state that removes `S` from a branch inherited from `(*,G)` after SPT transition; it is not a third tree.

**How does BSR elect a BSR?** Highest BSR priority, then highest address. This differs from candidate-RP selection, where lower RP priority is preferred.

**How does BSR choose among equal-priority RPs?** Routers apply the standardized group/RP hash using the hash-mask length; it distributes groups, not packets.

**Does a backup BSR provide a backup RP?** No. The BSR distributes mappings; candidate RPs serve groups. Each role needs its own redundancy.

**What three planes must RP redundancy solve?** Consistent group mapping, reachability to a live RP, and source-state discovery/synchronization.

**Why does Anycast RP require synchronization?** Source Registers and receiver Joins to the same anycast address can reach different physical members.

**MSDP Anycast versus PIM Anycast?** MSDP exchanges SA knowledge over TCP between unique member addresses; RFC 4610 copies Registers to all configured members.

**Why can established traffic survive RP failure?** An `(S,G)` SPT bypasses the RP, while new ASM sources and receivers still need rendezvous.

**What is the PIM Assert election order?** Prefer source-tree over RPT, then lower route preference, lower metric, and higher IP address.

**What does a PIM neighbor not prove?** Correct MRIB/RPF, RP mapping, Join state, OIL, data arrival, or hardware replication.
