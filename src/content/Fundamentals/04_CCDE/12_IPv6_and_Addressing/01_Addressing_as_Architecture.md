# Addressing as architecture

IP addresses encode **hierarchy, tenancy, and summarization**. A pretty IGP cannot save a random /24 allocation from every ticket.

## What the plan must enable

- Regional/building summaries
- Security zones identifiable (or deliberately *not*, if you do not want IP=role)
- Dual-stack: v6 plan as first-class, not “we will NAT”
- Overlap strategy for M&A (CGN inside is a last resort)

Document: public vs private, ULA vs GUA, who assigns, what is anycast.

## Interview framing

“The address plan is the skeleton of summarization and sometimes of policy. I design it before I draw OSPF areas.”

---
