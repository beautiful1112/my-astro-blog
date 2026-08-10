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

Full process and failover: [PIM BSR complete process](05_PIM_BSR_Complete_Process.md). Config recipe: [BSR configuration pattern](../14_Configuration_and_Observation/06_PIM_BSR_Config_Pattern.md).

## Auto-RP message interaction

Auto-RP uses two well-known groups:

| Message | Group | Direction |
|---|---|---|
| RP-Announce | `224.0.1.39` | Candidate RP → mapping agents |
| RP-Discovery | `224.0.1.40` | Mapping agent → all PIM routers |

1. Each candidate RP periodically multicasts Announce with its RP address and group ranges.
2. Mapping agents collect Announces, select the preferred RP per range (implementation rules; often highest IP among equals), and multicast Discovery containing the chosen maps.
3. Ordinary routers listen to Discovery only and install `RP(G)`.
4. Holdtime expiry removes stale candidates; agents update Discovery.

### Auto-RP bootstrap issue

Announce and Discovery are themselves multicast. A purely sparse-mode network needs some way to carry those control groups before it knows the RP mapping. Implementations commonly use a sparse-dense mode, an Auto-RP listener feature, or static treatment for the discovery groups. If that bootstrap mechanism is absent, mapping can fail even when PIM neighbors are healthy.

Detailed Cisco-centric recipe: [Auto-RP config pattern](../14_Configuration_and_Observation/15_Auto_RP_Config_Pattern.md).

## Precedence and policy

Static, BSR, Auto-RP, and embedded mappings can coexist, but precedence is implementation-specific beyond the rules of each individual mechanism. Document:

- authoritative mechanism per group range;
- more-specific versus less-specific mappings;
- ASM, BIDIR, and SSM ranges;
- accepted candidate RP and BSR addresses;
- scope boundaries; and
- expected mapping on routers at each site.

Validate the operational mapping on the FHR, LHR, intermediate routers, and the chosen RP—not only the configuration.

## Configuration patterns

### Static RP — Cisco IOS / IOS XE

```text
ip access-list standard ASM-GROUPS
 permit 239.10.0.0 0.0.255.255
ip pim rp-address 192.0.2.1 group-list ASM-GROUPS
```

### Static RP — Junos

```text
set protocols pim rp static address 192.0.2.1 group-ranges 239.10.0.0/16
```

### Static RP — FRRouting

```text
router
 ip pim rp 192.0.2.1 239.10.0.0/16
```

### Auto-RP — Cisco (sketch)

```text
! Candidate RP
ip pim send-rp-announce Loopback0 scope 16 group-list ASM-GROUPS
! Mapping agent
ip pim send-rp-discovery Loopback0 scope 16
! Listeners without densing all groups (where supported)
ip pim autorp listener
```

### BSR

Prefer the dedicated recipe: [06_PIM_BSR_Config_Pattern.md](../14_Configuration_and_Observation/06_PIM_BSR_Config_Pattern.md). Junos environments typically use BSR or static rather than Auto-RP.

## Interactions

| Mechanism | Relationship |
|---|---|
| **PIM-SM Registers / (*,G)** | Consume the selected `RP(G)` |
| **Anycast RP** | Same logical address; mapping method still required |
| **BIDIR flag** | Mapping must mark bidirectional ranges explicitly |
| **SSM range** | Must never be absorbed by ASM RP maps |
| **MSDP** | Independent of how `RP(G)` was learned |
| **Multicast boundary** | Should contain Auto-RP / BSR flooding at admin edges |

## Verification

1. On FHR, LHR, transit, and RP: same `RP(G)` for the test group.
2. For BSR: same elected BSR and complete RP-set fragments.
3. For Auto-RP: Announce reaches agents; Discovery reaches all routers; bootstrap method works under sparse interfaces.
4. Fail the active RP and the distribution agent/BSR independently; start a **new** source and receiver during each failure.
5. Confirm SSM groups show no RP map.

```text
show ip pim rp mapping
show ip pim rp-hash 239.10.10.10
show ip pim bsr-router
show ip pim autorp
show pim rps
```

## Risks

- Configuration drift on static maps between sites.
- Auto-RP bootstrap “fixed” by sparse-dense that also densifies user groups.
- Mixed Auto-RP and BSR without documented precedence.
- Catch-all RP stealing `232/8` or BIDIR ranges.
- Assuming Anycast reachability replaces MSDP/PIM source sync.

## Interview framing

“RP mapping only answers which address serves `G`—static is deterministic, BSR floods a hashed RP-set, Auto-RP uses Announce `224.0.1.39` and Discovery `224.0.1.40` and needs a sparse-mode bootstrap plan.”

---
