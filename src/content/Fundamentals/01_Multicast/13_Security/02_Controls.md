# Multicast security controls

Controls map to the threats in [Threats](01_Threats.md). Prefer SSM and explicit allowlists; enforce the three-level boundary in [Boundary principle](03_Boundary_Principle.md). Detailed templates: [Multicast boundary and ACL config](../14_Configuration_and_Observation/16_Multicast_Boundary_and_ACL_Config.md).

## Control set

- Prefer SSM and allowlist `(S,G)` tuples.
- Validate source addresses and block unauthorized multicast senders.
- Apply group/source boundaries and ACLs between zones.
- Restrict ports allowed to source data or control messages.
- Protect the control plane without starving legitimate convergence.
- Authenticate/protect PIM where justified and supported.
- Protect MSDP TCP sessions and filter SA ranges.
- Encrypt at application or tunnel layer when confidentiality is required.
- Monitor new `(S,G)` state, unexpected joins, RP changes, and fan-out.

| Control | Primary threat |
|---|---|
| SSM + IGMPv3 INCLUDE | Random ASM sources |
| uRPF / ACLs on source VLAN | Spoofed `S` |
| Multicast boundary | Cross-zone leakage |
| IGMP filter / port ACL | Unauthorized receivers |
| CoPP / storm control | Control-CPU exhaustion |
| MSDP SA filter | Poisoned interdomain sources |
| App TLS/DTLS on recovery | Confidentiality (live feed often cleartext) |

## Configuration patterns

### Cisco — multicast boundary + group ACL

```text
ip access-list standard MD-GROUPS
 permit 232.10.10.0 0.0.0.255
 deny 224.0.0.0 15.255.255.255
!
interface GigabitEthernet0/0
 description toward-office-vrf
 ip address 198.51.100.1 255.255.255.252
 ip pim sparse-mode
 ip multicast boundary MD-GROUPS filter-autorp
```

### Cisco — IGMP access-group (receiver admission)

```text
ip access-list standard MD-IGMP-ALLOW
 permit 232.10.10.0 0.0.0.255
!
interface Vlan100
 ip igmp access-group MD-IGMP-ALLOW
 ip igmp version 3
```

### Cisco — source admission on FHR LAN

```text
ip access-list extended MD-SRC-ONLY
 permit udp host 192.0.2.10 host 232.10.10.10 eq 15000
 deny udp any 224.0.0.0 15.255.255.255
 permit ip any any
!
interface Vlan10
 ip access-group MD-SRC-ONLY in
 ip pim sparse-mode
```

### Junos — scope / boundary sketch

```text
set routing-options multicast scope md-edge domain-prefix 232.10.10.0/24 interface ge-0/0/0.0
set protocols igmp interface irb.100 group-policy MD-IGMP
set policy-options prefix-list MD-IGMP 232.10.10.0/24
```

### FRRouting — PIM boundary (feature-dependent)

```text
interface eth0
 ip pim
 ip multicast boundary oil MD-GROUPS
!
! Combine with host firewall / nftables for sender allowlist
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **PIM-SSM** | Reduces RP attack surface |
| **Anycast RP / MSDP** | Needs SA filters matching business policy |
| **CoPP** | Must allow legitimate PIM/IGMP rates |
| **App encryption** | Does not stop join-based traffic pull |

## Verification

```text
show ip multicast boundary
show ip igmp interface Vlan100
show ip access-lists MD-SRC-ONLY
# From wrong host: sendto 232.10.10.10 — expect drop / no mroute
# From wrong VLAN: IGMP join — expect filter reject
```

Cross-check full examples in [Boundary ACL config](../14_Configuration_and_Observation/16_Multicast_Boundary_and_ACL_Config.md).

## Risks

- Boundaries only on data plane while Auto-RP/BSR flood freely.
- Over-tight CoPP dropping Joins under scale-in.
- Allowlisting groups but not sources on ASM.

## Interview framing

“Controls are SSM allowlists, source and receiver ACLs, multicast boundaries between zones, control-plane protection, and filtered MSDP—plus application crypto when confidentiality matters.”

---
