# Legacy multicast routing protocols

Before PIM-SM/SSM dominated enterprise and data-center designs, several multicast routing approaches were deployed. Interviews often ask for the traffic-density and state trade-off—not only protocol names.

| Protocol | Model | Notes |
|---|---|---|
| **DVMRP** | Distance-vector flood-and-prune | Early Internet MBONE; dense-mode style state |
| **MOSPF** | OSPF extension; trees from LSDB + membership | Requires MOSPF everywhere in the area |
| **CBT** | Core-based shared trees | Historical; influenced shared-tree thinking |
| **PIM-DM** | Flood-and-prune, protocol-independent | Still seen; poor fit for sparse high-bandwidth feeds |
| **PIM-SM / SSM** | Explicit join trees | Dominant modern model |

## Density trade-off

```text
Dense (flood-and-prune):  assume many receivers; prune where unwanted
Sparse (explicit join):   assume few receivers; build state on demand
SSM:                      sparse + known source; no shared-tree/RP
```

Market-data and WAN distribution are almost always **sparse**: high rate, selective receivers. Flood-and-prune wastes bandwidth and creates prune state churn.

Related: [PIM overview modules](../08_PIM/), [RP purpose](../09_Rendezvous_Point/01_RP_Purpose.md).

## Why PIM won operationally

- **Protocol independent:** uses existing unicast/MRIB reachability instead of a parallel IGP for multicast topology alone.
- **Sparse mode:** matches selective receiver sets.
- **SSM:** removes RP complexity for one-source channels.
- **Vendor ubiquity:** interoperable Join/Prune semantics in practice.

MOSPF couples multicast to OSPF flooding scale; DVMRP’s DV dependencies aged poorly; CBT saw limited deployment.

## Configuration patterns (legacy encounter)

### Cisco — PIM dense (know it to migrate away)

```text
interface GigabitEthernet0/1
 ip pim dense-mode
! Prefer:
 ip pim sparse-mode
ip pim ssm default
```

### Migration sketch

```text
1. Inventory groups and sources
2. Prefer SSM 232/8 for one-source apps
3. Remaining ASM → sparse + explicit RP
4. Remove dense-mode interfaces
5. Confirm no flood-and-prune during peaks
```

### FRR

```text
interface eth0
 ip pim
! Dense mode is not the modern default path—prefer sparse + SSM range
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **IGMP** | Membership still drives interest; DM vs SM changes WAN behavior |
| **MBGP** | Modern interdomain RPF; not part of classic DVMRP/MOSPF stories |
| **Bidir-PIM** | Another shared-tree variant for many-to-many—not “legacy,” but specialized |

## Verification

When discovering an old domain:

```text
show ip pim interface
show ip mroute
! Look for dense, DVMRP, or MOSPF references in configs/docs
show running-config | include pim|dvmrp|mospf
```

Prove whether traffic is pruned or explicitly joined under a quiet receiver test.

## Risks

- Enabling PIM-DM “because multicast is broken” on a trading WAN.
- Mixed DM/SM islands creating unexpected flood domains.
- Assuming MOSPF knowledge transfers to PIM RPF troubleshooting.

## Interview framing

“Legacy DVMRP/MOSPF/CBT and PIM-DM optimize for denser receiver assumptions; modern designs use PIM-SM/SSM explicit joins because sparse, high-rate distribution cannot afford flood-and-prune.”

---
