# Hierarchical campus

Access / distribution / core exists to **modularize** failure and change. Collapse tiers when the site is small; do not collapse when you still need the module.

```text
Access (policy, PoE, trust)
   |
Distribution (L2/L3 boundary, summary, FHRP or L3 access)
   |
Core (fast, simple, few prefixes)
```

Software-defined campus (SDA/EVPN) still has these **roles**, even if boxes are “fabric edge / border / control.”

Cloud-managed (e.g. Meraki-style) changes the **management plane**, not the need for a failure-domain story.

Three-tier vs collapsed core: collapsed is fine for a small building; a multi-building campus that collapses everything into two stacked cores is a fate-share.

## Interview framing

“Campus hierarchy is modules: access policy, distribution summary, skinny core. I collapse only when the site is small enough that the blast radius stays acceptable.”

---
