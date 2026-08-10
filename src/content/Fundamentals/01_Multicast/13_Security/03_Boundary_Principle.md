# The three-level boundary principle

Apply policy at three levels:

1. **Source admission:** who may send which groups?
2. **Tree admission:** which interfaces/routers may create state?
3. **Receiver admission:** which VLANs, ports, and hosts may receive?

A firewall rule allowing UDP to `239.0.0.0/8` is not a complete security design. Wire the levels to concrete ACLs in [Multicast boundary and ACL config](../14_Configuration_and_Observation/16_Multicast_Boundary_and_ACL_Config.md) and the control patterns in [Controls](02_Controls.md).

## Level map

```text
Source VLAN/port  --(1)-->  FHR / first boundary
Routed core       --(2)-->  PIM OIL / boundaries / MSDP SA
Receiver VLAN/port --(3)--> IGMP filter / snooping / host FW
```

| Level | Mechanisms |
|---|---|
| Source | Port ACL, uRPF, FHR boundary, SSM-only |
| Tree | `ip multicast boundary`, PIM neighbor filter, RP accept ACL, MSDP SA filter |
| Receiver | IGMP access-group, snooping filter, host firewall, private VLAN patterns |

## Configuration patterns

### Level 1 — source admission (Cisco)

```text
ip access-list extended SRC-ADMIT
 permit udp host 192.0.2.10 host 232.10.10.10 eq 15000
 permit udp host 192.0.2.11 host 232.10.10.11 eq 15000
 deny ip any 224.0.0.0 15.255.255.255
 permit ip any any
!
interface Vlan10
 description source-lan
 ip access-group SRC-ADMIT in
 ip pim sparse-mode
```

### Level 2 — tree / zone boundary (Cisco)

```text
ip access-list standard TREE-BOUNDARY
 permit 232.10.10.0 0.0.0.255
 deny 224.0.0.0 15.255.255.255
!
interface GigabitEthernet0/1
 description to-non-trading-vrf
 ip pim sparse-mode
 ip multicast boundary TREE-BOUNDARY filter-autorp
```

### Level 2 — Junos scope

```text
set routing-options multicast scope trading-edge domain-prefix 232.10.10.0/24 interface ge-0/0/1.0
```

### Level 3 — receiver admission (Cisco)

```text
ip access-list standard RCV-ADMIT
 permit 232.10.10.0 0.0.0.255
!
interface Vlan100
 ip igmp access-group RCV-ADMIT
 ip igmp version 3
 ip pim sparse-mode
```

### Level 3 — Linux host

```text
# nftables / iptables: allow only expected groups/ports on feed NIC
iptables -A INPUT -i eth0 -p udp -d 232.10.10.10 --dport 15000 -j ACCEPT
iptables -A INPUT -i eth0 -p udp -d 224.0.0.0/4 -j DROP
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **SSM** | Source admission aligns with INCLUDE list |
| **Auto-RP/BSR** | Must be filtered at level 2 or mapping leaks |
| **MVPN** | Levels apply on PE-CE **and** P-tunnel policy |

## Verification

Test each level independently:

1. Unauthorized source → no FHR Register / no `(S,G)` accept.
2. Join from wrong VRF → boundary blocks OIL growth.
3. Host in wrong VLAN → IGMP reject; no snooping entry.

```text
show ip multicast boundary
show ip igmp groups
show ip mroute 192.0.2.10 232.10.10.10
tcpdump -ni eth0 igmp
```

See also [Boundary ACL config](../14_Configuration_and_Observation/16_Multicast_Boundary_and_ACL_Config.md).

## Risks

- Implementing only level 3 (receivers) while open sources remain.
- Broad `permit 239.0.0.0/8` on a firewall called a “boundary.”
- Forgetting control-plane group ranges (224.0.0.0/24) when writing deny ACLs—break PIM carefully.

## Interview framing

“Secure multicast with three boundaries—who may send, where trees may build, and who may receive—not with a single UDP allow to 239/8.”

---
