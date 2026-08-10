# Passive interfaces

**`passive-interface`** in EIGRP stops the router from sending Hellos (and forming neighbors) on that interface, while still allowing the interface’s networks to be **advertised** into EIGRP (when covered by `network` / AF). It is an adjacency boundary tool—not the same as a topology table **Passive** route state.

## Contrast the two “passives”

| Term | Meaning |
|---|---|
| `passive-interface` | No Hellos / no neighbors on iface |
| Topology **Passive** | DUAL stable for a prefix |

Related: [Core terminology](../02_Fundamentals/05_Core_Terminology.md), [Neighbor formation requirements](01_Neighbor_Formation_Requirements.md).

## Common design pattern

```text
passive-interface default
 no passive-interface toward core/peers
 advertise access subnets without speaking EIGRP to hosts
```

Prevents accidental adjacencies on user VLANs while still injecting those prefixes.

## Configuration patterns

### Cisco IOS / IOS XE — classic

```text
router eigrp 100
 network 10.0.0.0 0.255.255.255
 passive-interface default
 no passive-interface GigabitEthernet0/0
 no passive-interface GigabitEthernet0/1
```

### Named mode

```text
router eigrp CAMPUS
 address-family ipv4 unicast autonomous-system 100
  af-interface default
   passive-interface
  exit-af-interface
  af-interface GigabitEthernet0/0
   no passive-interface
  exit-af-interface
  network 10.0.0.0 0.255.255.255
 exit-address-family
```

## Verification

```text
show ip protocols
show ip eigrp interfaces
show ip eigrp neighbors
```

Passive interfaces disappear from “EIGRP-speaking” interface lists; networks still show in topology/RIB if originated.

Lab checks:

1. Passive user VLAN; confirm no neighbor, prefix still advertised upstream.
2. Accidentally passive a core link; neighbor drops; fix with `no passive`.
3. Compare stub vs passive: stub still has neighbors but limits query/advertising roles.

## Risks

- Passive on the only peer interface → isolated router.
- Confusing passive-interface with stub.
- Named mode: setting passive only under wrong AF.

## Interview framing

“EIGRP passive-interface blocks Hellos and adjacency on that link while still advertising the connected network—do not confuse it with DUAL Passive state.”

---
