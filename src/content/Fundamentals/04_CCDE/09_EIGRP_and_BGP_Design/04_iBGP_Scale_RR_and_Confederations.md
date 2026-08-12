# iBGP scale: RR and confederations

iBGP full mesh is O(n²). **Route reflectors** (and less often confederations) are the scale tools.

## RR design

- RR is a **control-plane** role; it should not be a hidden data-plane chokepoint unless you intend that.
- Place RRs in pairs, diverse, often at regional cores.
- Clusters and ORIGINATOR_ID/CLUSTER_LIST prevent loops; still watch **suboptimal** reflection (hot potato vs intended exit).
- Do not put all RRs on one hypervisor cluster (fate share).

Confederations split an AS into sub-ASes when RR hierarchy and policy need **AS_PATH-like** boundaries inside one admin domain. Heavier ops—use when RR is not enough.

## Interview framing

“I scale iBGP with paired, site-diverse RRs and I treat the RR as control-plane only unless the design says otherwise. Confederations are a last resort for policy boundaries.”

---
