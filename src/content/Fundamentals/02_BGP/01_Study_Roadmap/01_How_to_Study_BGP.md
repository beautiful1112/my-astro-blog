# How to study BGP

Use four passes:

1. **Protocol mechanics:** sessions, finite-state machine, messages, RIBs, and attributes.
2. **Policy and selection:** predict which route is accepted, selected, installed, and advertised.
3. **Scale and services:** route reflection, MP-BGP, VPNs, EVPN, FlowSpec, and BGP-LS.
4. **Operations and interviews:** troubleshoot from evidence, solve failure cases, and explain trade-offs.

For every prefix, ask four separate questions:

1. Was it received into Adj-RIB-In?
2. Did import policy make it eligible and best in the Loc-RIB?
3. Was it installed in the forwarding table?
4. Was it permitted into each neighbor's Adj-RIB-Out?

Never treat “the BGP session is Established” as proof that useful routing is correct.

---

