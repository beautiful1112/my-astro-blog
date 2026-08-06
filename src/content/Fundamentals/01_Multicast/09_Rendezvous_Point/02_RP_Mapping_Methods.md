# Group-to-RP mapping methods

RP discovery answers one control-plane question: **which RP address should this router use for group `G`?** It does not make the RP reachable, synchronize active-source state between different RPs, or guarantee that every router installed the same mapping.

| Method | Distribution model | Strength | Main failure concern |
|---|---|---|---|
| Static RP | configured on every relevant router | simple and deterministic | configuration drift and manual migration |
| PIM Bootstrap Router (BSR) | candidate RPs advertise to elected BSR; BSR floods RP-set | standards-based dynamic distribution | BSR/RP-set scope, election, expiry, filtering |
| Auto-RP | mapping agents advertise candidate RP information | common in Cisco-originated networks | vendor dependence and sparse-mode bootstrap issue |
| Embedded RP | IPv6 group encodes RP information | mapping follows address construction | address constraints and limited operational use |
| Anycast RP | several physical routers share one logical RP address | nearest-RP reachability and fast routing failover | source-state synchronization still required |

Anycast is usually combined with a mapping method: routers may learn the shared anycast address statically or through BSR/Auto-RP.

## Static mapping

Static configuration is appropriate for small, controlled domains when automation guarantees consistency. Scope each RP to explicit group ranges. A catch-all mapping can accidentally absorb groups intended for SSM or another service.

“Configure two static RPs” is not a portable redundancy design. Selection and fallback rules vary by vendor; different routers can select different addresses. Prefer a documented primary/backup feature or an Anycast design and test source discovery during failure.

## BSR mapping selection

The elected BSR distributes an RP-set containing group prefix, RP address, RP priority, holdtime, and mode information. Routers independently select an RP for `G`:

1. find mappings whose group prefix covers `G`;
2. prefer the longest matching group prefix;
3. prefer the **lowest numeric RP priority**;
4. when equal candidates remain, apply the standardized hash using `G`, the RP address, and the advertised hash-mask length;
5. use the highest RP address as the final tie-breaker.

This hash gives stable group-to-RP distribution, not per-packet load balancing. All routers need the same complete RP-set and hash parameters.

Do not confuse priorities: **higher BSR priority wins the BSR election; lower candidate-RP priority is better for RP selection.**

## Auto-RP bootstrap issue

Auto-RP discovery and announcement groups are multicast. A purely sparse-mode network needs some way to carry those control groups before it knows the RP mapping. Implementations commonly use a sparse-dense mode, an Auto-RP listener feature, or static treatment for the discovery groups. If that bootstrap mechanism is absent, mapping can fail even when PIM neighbors are healthy.

## Precedence and policy

Static, BSR, Auto-RP, and embedded mappings can coexist, but precedence is implementation-specific beyond the rules of each individual mechanism. Document:

- authoritative mechanism per group range;
- more-specific versus less-specific mappings;
- ASM, BIDIR, and SSM ranges;
- accepted candidate RP and BSR addresses;
- scope boundaries; and
- expected mapping on routers at each site.

Validate the operational mapping on the FHR, LHR, intermediate routers, and the chosen RP—not only the configuration.

