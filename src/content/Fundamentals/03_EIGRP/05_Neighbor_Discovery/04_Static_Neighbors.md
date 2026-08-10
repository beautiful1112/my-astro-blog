# Static neighbors

A **static EIGRP neighbor** forces unicast Hellos and routing packets to a configured address on a specified interface. Classic use: **NBMA** clouds (Frame Relay, some DMVPN pitfalls historically) where multicast to 224.0.0.10 does not work reliably to all PVCs/peers.

## Behavior

```text
router eigrp 100
 neighbor 10.0.0.2 Serial0/0
```

Effects (Cisco typical):

- Unicast EIGRP to that IP;
- **Multicast EIGRP disabled on that interface** for dynamic discovery—dangerous on multi-access LAN if misunderstood;
- Still requires AS/K-values/subnet/auth match.

Related: [Multicast addresses](../04_Packets_and_Transport/08_Multicast_Addresses.md), [Neighbor formation requirements](01_Neighbor_Formation_Requirements.md).

## When to use / avoid

| Use | Avoid |
|---|---|
| NBMA hub-spoke without mcast | Ethernet LAN “just because” |
| Controlled unicast-only paths | As substitute for fixing L2 multicast |
| Labs proving unicast RTP | Mixing static + expecting dynamic peers on same iface |

## Configuration patterns

### Cisco IOS / IOS XE — classic

```text
interface Serial0/0
 ip address 10.0.0.1 255.255.255.0
!
router eigrp 100
 network 10.0.0.0 0.0.0.255
 neighbor 10.0.0.2 Serial0/0
 neighbor 10.0.0.3 Serial0/0
```

Hub lists each spoke; spokes list the hub (design-dependent).

### Named mode

```text
router eigrp WAN
 address-family ipv4 unicast autonomous-system 100
  neighbor 10.0.0.2 Serial0/0
```

Exact `neighbor` placement can be under AF; confirm image syntax.

## Verification

```text
show ip eigrp neighbors detail
! look for "Static neighbor" / unicast indications
show ip eigrp interfaces
debug eigrp packets hello
```

Capture should show unicast to neighbor IP, not 224.0.0.10, for those Hellos.

## Risks

- Static neighbor on LAN → kills dynamic multicast neighbors on that interface.
- One-sided static config → adjacency fails.
- Forgetting to re-add spokes after hub migration.

## Interview framing

“Static EIGRP neighbors force unicast on NBMA and disable multicast discovery on that interface—use for non-broadcast clouds, not as a casual LAN knob.”

---
