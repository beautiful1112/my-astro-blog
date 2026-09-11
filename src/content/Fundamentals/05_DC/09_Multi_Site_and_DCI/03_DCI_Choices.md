# DCI choices

| Choice | Use when | Primary caution |
|---|---|---|
| L3-only DCI | Applications can use DNS, load balancers, or routed failover | Requires application-aware recovery design |
| L2VNI extension | A justified workload or appliance truly needs subnet continuity | Expands broadcast and failure domains; control unknown unicast |
| Anycast BGW | Both gateways can actively represent the site | Validate vendor multi-site semantics and failure behavior |
| vPC / MLAG BGW | Attached services require a dual-homed logical pair | Peer-link and split-brain behavior become part of DCI risk |

## Boundary rule

Use local route reflectors inside each site and eBGP EVPN between border gateways where appropriate. Preserve tenant RT policy, suppress needless site-local routes, and keep L2 extension on an explicit allowlist.

## Related

- [EVPN Multi-Site](02_EVPN_Multi_Site.md)
- [DCI patterns](../../04_CCDE/14_Data_Center_and_Cloud/03_DCI_Patterns.md)

---
