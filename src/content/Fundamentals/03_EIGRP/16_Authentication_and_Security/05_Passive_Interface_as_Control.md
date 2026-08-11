# Passive interface as control

`passive-interface` stops EIGRP from sending hellos and forming adjacencies on an interface while still **advertising the connected network** (unless also filtered). It is the primary control to keep EIGRP off access/user LANs.

## Behavior

| Setting | Hellos | Adjacency | Network advertised |
|---|---|---|---|
| Normal | Yes | Yes | Yes (if `network` matches) |
| Passive | No | No | Yes |
| No `network` / not in AF | No | No | No |

Passive is **not** authentication; it is adjacency scope control.

## Classic mode

```text
router eigrp 100
 passive-interface default
 no passive-interface GigabitEthernet0/0
 no passive-interface Tunnel0
 network 10.0.0.0 0.255.255.255
```

Pattern: default passive, then explicitly enable transit links.

## Named mode

```text
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  af-interface default
   passive-interface
  exit-af-interface
  af-interface GigabitEthernet0/0
   no passive-interface
  exit-af-interface
```

## Design usage

```text
Distribution --> Core link: not passive
D --> Access VLAN: passive
D --> Access VLAN: passive
```

- Access SVIs: passive (advertise VLAN subnets upward, no user adjacency).
- Core/WAN: not passive.
- DMVPN spoke tunnel: not passive; LAN behind spoke often passive.

## Verification

```text
show ip protocols | section eigrp
! Passive Interface(s):
show ip eigrp interfaces
! passive interfaces absent from neighbor-capable list
show ip eigrp neighbors
```

If an unexpected neighbor appears on an access VLAN, passive was missed.

## Risks

- Passive on a transit link → no adjacency, silent blackhole of dynamic routes.
- Forgetting `no passive` after `passive-interface default`.
- Assuming passive stops advertising the connected prefix (it does not).

## Interview framing

“Passive-interface suppresses hellos but still injects the connected network into EIGRP—use default passive and allow-list only real peer links.”

## Related

- [Why Authenticate EIGRP](01_Why_Authenticate_EIGRP.md)
- [Hub-Spoke WAN Checklist](../17_WAN_NBMA_and_Tunnels/06_Hub_Spoke_WAN_Checklist.md)
- [Neighbors Not Forming](../20_Troubleshooting/02_Neighbors_Not_Forming.md)

---
