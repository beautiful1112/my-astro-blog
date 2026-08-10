# Well-known multicast control groups

Control-plane protocols reuse fixed multicast groups. Mis-filtering them breaks PIM, IGMP, or IPv6 Neighbor Discovery even when “application multicast” looks fine.

## IPv4

| Group | Meaning |
|---|---|
| `224.0.0.1` | All IPv4 multicast-capable systems on-link |
| `224.0.0.2` | All IPv4 multicast routers on-link |
| `224.0.0.13` | All PIM routers (Hello, Join/Prune, Assert, …) |
| `224.0.0.22` | IGMPv3 membership reports |
| `224.0.1.39` / `224.0.1.40` | Auto-RP announce / discovery (Cisco legacy) |

`224.0.0.0/24` is **link-local**: routers do not forward it. TTL is irrelevant for inter-LAN reachability.

## IPv6

| Group | Meaning |
|---|---|
| `ff02::1` | All nodes on-link |
| `ff02::2` | All routers on-link |
| `ff02::d` | All PIM routers on-link |
| `ff02::16` | MLDv2 report destination / MLDv2-capable routers |
| `ff02::1:ffxx:xxxx` | Solicited-node (ND) |

Related: [IPv4 address space](01_IPv4_Multicast_Address_Space.md), [IGMP destination matrix](../05_IGMP_and_MLD/24_IGMP_MLD_Destination_Matrix.md), [PIM Hello](../08_PIM/08_PIM_Hello_DR_and_LAN.md).

## Message destinations (quick)

| Message | Typical destination |
|---|---|
| IGMPv2 report | Group address being joined |
| IGMPv3 report | `224.0.0.22` |
| IGMP general query | `224.0.0.1` |
| PIM Hello / JP | `224.0.0.13` |
| MLDv2 report | `ff02::16` |

## Configuration patterns

Allow control groups on host/router ports; do not put them in application boundaries.

### Cisco IOS / IOS XE

```text
ip access-list extended MC-BOUNDARY
 ! deny application ranges at WAN
 deny   ip any 239.0.0.0 0.255.255.255
 permit ip any any
!
interface GigabitEthernet0/0
 ip multicast boundary MC-BOUNDARY in
 ! Do not block 224.0.0.0/24 on LAN interfaces needed for PIM/IGMP
```

### Junos

```text
set policy-options prefix-list APP-MC 239.0.0.0/8
set protocols pim interface ge-0/0/0.0 scoped-group APP-MC
! Link-local control groups remain local to the LAN
```

### Linux — capture control plane

```text
tcpdump -ni eth0 net 224.0.0.0/24
tcpdump -ni eth0 ip proto 103
tcpdump -ni eth0 icmp6 and ip6 multicast
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **Snooping** | Must flood `224.0.0.22` / queries toward routers |
| **CoPP** | Over-policing PIM/IGMP groups drops adjacencies |
| **Storm control** | Can punish control multicast on access ports |
| **Host ACLs** | Blocking `224.0.0.22` breaks IGMPv3 |

## Verification

1. PIM Hellos visible to `224.0.0.13` / `ff02::d` between neighbors.
2. IGMPv3 reports to `224.0.0.22` reach the querier.
3. WAN boundary denies `239/8` but LAN still passes link-local control.
4. IPv6 NS/NA to solicited-node groups still succeed after MLD snooping enable.

```text
show ip pim neighbor
show ip igmp interface
show ipv6 pim neighbor
tcpdump -ni eth0 dst 224.0.0.13
```

## Risks

- ACL “deny all multicast” on a router LAN port.
- CoPP copied from unicast templates that rate-limit `224.0.0.0/4`.
- Filtering Auto-RP groups while still depending on Auto-RP.

## Interview framing

“Know the control groups—224.0.0.13 for PIM, 224.0.0.22 for IGMPv3, ff02::d / ff02::16 for IPv6—and never boundary-filter link-local control the way you filter application groups.”

---
