# Interview: Why Does iBGP Need a Full Mesh?

## Question

Why does classic iBGP require a full mesh? How do route reflectors and confederations change that?

## Strong answer

iBGP speakers do not re-advertise routes learned from one iBGP peer to another iBGP peer (split horizon). Without an alternate distribution mechanism, every iBGP speaker must learn external routes directly from every other speaker that injects them—hence \(n(n-1)/2\) sessions.

**Route reflectors** relax split horizon under RR client/non-client rules so clients need only sessions to RRs (and carefully designed RR redundancy). Cost: path hiding unless ADD-PATH/diverse design. **Confederations** split one AS into member ASes so eBGP-like rules apply between members while presenting one ASN externally.

## Follow-ups

- What is an RR cluster-list loop?
- When is next-hop-self still required with RRs?
- How does path hiding hurt low-latency designs?

## Cross-links

[iBGP split horizon](../12_eBGP_and_iBGP/02_iBGP_Split_Horizon_and_Full_Mesh.md), [RR path hiding interview](10_Route_Reflector_Path_Hiding.md).

---
