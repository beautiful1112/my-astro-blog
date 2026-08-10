# IPv4-to-Ethernet multicast mapping

IPv4 multicast maps to Ethernet MACs in **`01:00:5e:00:00:00`–`01:00:5e:7f:ff:ff`**. Copy only the **low 23 bits** of the IPv4 group. ARP is not used—the mapping is algorithmic.

## Algorithm

For group `A.B.C.D`:

```text
MAC = 01:00:5e : (B & 0x7f) : C : D
```

Worked example `239.1.2.3`:

```text
239.1.2.3 = EF:01:02:03
MAC       = 01:00:5e:01:02:03
```

IPv4 multicast has **28** variable group bits; Ethernet keeps **23**, so **32 IP groups alias to one MAC**. The NIC and IP stack must finish destination filtering. Limited NIC multicast-filter capacity can force the host into promiscuous/multicast promiscuous mode and raise CPU.

Related: [IPv4 address space](01_IPv4_Multicast_Address_Space.md), [Wrong multicast MAC case](../16_Practical_Cases/08_Wrong_Multicast_MAC.md), [Host NIC path](../11_Host_and_Application/05_NIC_Receive_Path.md).

## Alias example (32:1)

```text
224.1.1.1  → 01:00:5e:01:01:01
225.1.1.1  → 01:00:5e:01:01:01   (aliases)
...
239.1.1.1  → 01:00:5e:01:01:01   (aliases)
```

Pick groups that do not collide on the low 23 bits inside the same VLAN when hosts share NICs.

## Configuration patterns

Mapping itself is not configured; filtering and snooping are.

### Cisco IOS / IOS XE — snooping uses IP group, programs MAC

```text
ip igmp snooping
ip igmp snooping vlan 200
show mac address-table multicast
show ip igmp snooping groups vlan 200
```

### Junos

```text
set protocols igmp-snooping vlan MD-FEED
show igmp-snooping membership
show ethernet-switching table | match 01:00:5e
```

### Linux host — observe mapping

```text
ip maddr show
tcpdump -eni eth0 ether multicast and ip multicast
# Compare IP dst vs Ethernet dst
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **IGMP snooping** | Often keys on IP group but installs MAC entries |
| **NIC perfect filters** | Overflow → more frames punted to CPU |
| **MVR / VLAN translate** | Can rewrite VLAN while MAC mapping unchanged |
| **IPv6** | Different mapping (`33:33:` + low 32 bits) |

## Verification

1. Compute expected MAC from the group; match capture Ethernet DA.
2. On switch, confirm MAC/group programmed only on member + mrouter ports.
3. Join two aliasing groups on one host; confirm IP-layer filtering drops the unwanted one.
4. If app sees “wrong” channel, check alias collision before blaming PIM.

```text
show ip igmp snooping groups
show mac address-table multicast
tcpdump -eni eth0 dst 232.10.10.10
```

## Risks

- Assuming unique MAC ⇒ unique group.
- Debugging L3 when the host NIC filter is overflowing.
- Manual static MAC entries that disagree with the algorithm.

## Interview framing

“IPv4 multicast maps to 01:00:5e with the low 23 group bits—32 groups share one MAC—so the NIC and IP stack must filter, and ARP is never used.”

---
