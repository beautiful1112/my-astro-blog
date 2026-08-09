# Interview: How Does BGP Prevent Loops?

## Question

How does BGP prevent routing loops? What are the limits of AS_PATH?

## Strong answer

**AS_PATH** is the primary loop detector on eBGP: a speaker rejects routes that already contain its own ASN. iBGP relies on split horizon (and RR cluster-list / confederation mechanisms) rather than AS_PATH for intra-AS distribution loops.

Limits and intentional relaxations:

- Same-ASN multihoming / hub-spoke VPNs may need [allowas-in](../12_eBGP_and_iBGP/06_AllowAS_In.md) or [as-override](../12_eBGP_and_iBGP/07_AS_Override.md).
- Those relaxations require [SoO](../18_MPLS_L3VPN/07_Site_of_Origin.md) (or equivalent) to stop site feedback loops.
- AS_PATH does not stop route leaks between ASes that lack your ASN.
- RPKI validates origin, not path leaks; OTC/roles help leak prevention.

## Follow-ups

- allowas-in vs as-override—who rewrites vs who accepts?
- Why is SoO not optional when override is on?
- Confederations and AS_PATH segment types?

## Cross-links

[PE-CE toolkit](../18_MPLS_L3VPN/08_PE_CE_AS_Loop_Toolkit.md), [Interview 13](13_AllowAS_In_AS_Override_AIGP.md).

---
