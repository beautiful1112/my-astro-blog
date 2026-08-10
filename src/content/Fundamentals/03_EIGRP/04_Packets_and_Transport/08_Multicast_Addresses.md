# Multicast addresses

On multi-access segments, EIGRP uses link-local multicast to discover neighbors and often to send Updates/Queries efficiently:

| Family | Multicast group | Notes |
|---|---|---|
| IPv4 | **224.0.0.10** | All EIGRP routers |
| IPv6 | **FF02::A** | All EIGRP routers (link-local scope) |

These groups are **not** forwarded by routers as transit multicast market-data groups; they are control-plane link-scoped. Related: [IP protocol 88 and RTP](01_IP_Protocol_88_and_RTP.md), [Static neighbors](../05_Neighbor_Discovery/04_Static_Neighbors.md).

## When unicast is used

```text
ACK packets                 -> unicast
Reliable retransmissions    -> unicast to deaf neighbor
Static neighbor config      -> unicast Hellos/Updates (multicast disabled to peer)
Some NBMA environments      -> unicast preferred / required
```

```text
LAN:   Hello to 224.0.0.10
NBMA:  neighbor 10.0.0.2 Serial0/0  (unicast)
```

## L2 / ACL implications

| Check | Why |
|---|---|
| IGMP snooping / unsupported mcast on switch | Hellos never arrive |
| ACL permits 224.0.0.10 but not unicast proto 88 | Reliable delivery fails |
| Wrong VLAN | Multicast never shared |
| IPv6 ND/multicast filtering | FF02::A blocked |

## Configuration patterns

### Cisco — ensure interface speaks EIGRP multicast

```text
router eigrp 100
 network 10.1.1.0 0.0.0.255
! interface in that network will send Hellos to 224.0.0.10
```

### Force unicast

```text
router eigrp 100
 neighbor 10.1.1.2 GigabitEthernet0/0
```

With static `neighbor`, Cisco disables multicast on that interface for EIGRP toward dynamically discovered peers—design carefully on multi-access LANs (usually static neighbor is for NBMA).

## Verification

```text
show ip eigrp interfaces
show ip eigrp neighbors
show ip mroute 224.0.0.10
! capture: host 224.0.0.10 and ip proto 88
```

Lab checks:

1. Capture Hello to 224.0.0.10 on Ethernet.
2. Configure static neighbor; confirm unicast Hellos.
3. ACL drop 224.0.0.10; adjacency fails on LAN without static neighbor.

## Risks

- Static neighbor on a busy LAN → unexpected multicast disable side effects.
- Assuming `ping 224.0.0.10` proves EIGRP health (it does not).
- Forgetting FF02::A for IPv6 AF troubleshooting.

## Interview framing

“EIGRP uses 224.0.0.10 and FF02::A for link-local control multicast, but ACKs, retransmits, and static NBMA neighbors use unicast—both planes must be permitted.”

---
