# Ethernet Segment Identifier and Multihoming

An **Ethernet Segment Identifier (ESI)** identifies a customer Ethernet segment attached to one or more PEs/VTEPs. A **nonzero ESI shared** across PEs signals EVPN multihoming for that segment.

## Modes

| Mode | Behavior |
|---|---|
| **Single-active** | One PE forwards for the ES (per service); standby ready |
| **All-active** | Multiple PEs forward unicast; DF rules for BUM |
| Single-homing | ESI usually zero |

## What ESI enables

- Designated-forwarder election for BUM toward the CE.
- Split-horizon filtering so frames from the ES are not hairpinned back via another PE.
- **Aliasing**: remote PEs load-balance unicast to all PEs advertising the ES even if MAC learned on one.
- **Mass withdrawal** (Type-1) when the attachment fails—faster than per-MAC withdraw.

## ESI assignment rules

- Unique to the **actual** physical/logical segment (LAG to same CE, same MC-LAG domain).
- Same ESI + same Ethernet Tag on PEs that truly share the segment.
- Accidental reuse merges unrelated failure domains → wrong DF, blackholes, loops.

Common practice: derive ESI from LACP system MAC/priority or configure manually with a documented scheme (`00:11:22:…` style 10-octet value).

## Configuration sketch

```text
! Cisco (conceptual)
interface EtherChannel1
 evpn ethernet-segment
  identifier type 0 00.11.22.33.44.55.66.77.88.99
  load-balancing-mode all-active
```

```text
set interfaces ae0 esi 00:11:22:33:44:55:66:77:88:99
set interfaces ae0 esi all-active
set protocols evpn interface ae0
```

## Verification

```text
show evpn ethernet-segment
show bgp l2vpn evpn route-type 4
show bgp l2vpn evpn route-type 1
```

Confirm both PEs advertise the same ESI and that remote MAC routes show aliasing next hops.

## Interactions

| Mechanism | Relationship |
|---|---|
| **DF / split horizon** | [04](04_Designated_Forwarder_and_Split_Horizon.md) |
| **MAC mobility** | MH misconfig can look like flapping MACs |
| **L3VPN SoO** | Different tool for L3 site loops |

## Interview framing

“ESI names a multihomed Ethernet segment so EVPN can do DF election, split-horizon, aliasing, and mass withdraw; reuse of ESI across unrelated segments is a serious misconfiguration.”

---
