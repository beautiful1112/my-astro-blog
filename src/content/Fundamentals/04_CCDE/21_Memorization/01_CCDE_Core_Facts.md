# CCDE core facts

- Written 400-007 v3.1: ~2 h, 90–110 items, HLD + business, core tech list, closed book, dual stack.
- Practical: ~8 h, modules 1–3 core enterprise, module 4 elective (AI Infra, Large Scale, On-Prem/Cloud, Workforce Mobility).
- Designer loop: R/C/A → ≥2 options → trade-off → defend → migrate → measure.
- Planes: control / data / management (+ policy / orchestration when present).
- Default: minimize L2, L3 DCI, no Internet table in IGP, dual-stack, name fate-share.
- EIGRP: stub + summary = query bound.
- OSPF: area 0 backbone; stub/NSSA hide externals; summarize with discard.
- IS-IS: L2 contiguous; L1/L2 at edges.
- BGP: policy and seams; RR for iBGP scale.
- MPLS: hide tenants from P; RT = VPN topology.

---
