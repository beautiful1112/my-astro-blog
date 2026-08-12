# IS-IS for SP and MPLS

IS-IS often underpins **MPLS/SR** because the IGP carries TE/SR information and stays independent of IP as a transport for the IGP itself.

## Design notes

- Congruent vs noncongruent topologies (IGP vs TE/RSVP/SR): a CCDE large-scale topic—know whether transport follows IGP metric or a TE policy.
- Keep the IGP **underlay-clean**: loopbacks, link subnets, maybe anycast. Do not dump VPN prefixes into IS-IS.
- Fast convergence: BFD + TI-LFA/SR is a current pattern; still bound the domain.

## Interview framing

“In an SP core, IS-IS is the underlay for MPLS/SR. VPN state stays in BGP. I care that L2 is contiguous and that TE/SR policy is an explicit overlay on that underlay.”

---
