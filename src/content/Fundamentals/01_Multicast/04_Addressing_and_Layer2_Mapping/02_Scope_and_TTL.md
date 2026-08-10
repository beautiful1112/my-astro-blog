# Multicast scope and TTL

**Address scope** defines where a group is valid and must be bounded in the network. **TTL** (IPv4) / **Hop Limit** (IPv6) limits how far a particular packet may travel. They are complementary controls—neither replaces the other.

## Rules of thumb

- Address scope defines where a group is *allowed*; enforce with boundaries, scoping, and routing design.
- TTL limits the routed hop count of one packet; it does not invent scope.
- `224.0.0.0/24` is never routed regardless of TTL.
- TTL 1 does **not** stop Layer-2 flooding across a large bridged VLAN.
- TTL thresholds are a coarse legacy mechanism, not a substitute for multicast boundaries and ACLs.

Related: [IPv4 address space](01_IPv4_Multicast_Address_Space.md), [Security boundary principle](../13_Security/03_Boundary_Principle.md).

## Worked scenarios

| Intent | Address | TTL | Also required |
|---|---|---|---|
| On-link control only | `224.0.0.x` | any | nothing—routers won’t forward |
| Single routed hop lab | `239.10.1.1` | 2+ | PIM on that hop |
| Campus ASM | `239.10.0.0/16` | enough for diameter | boundaries at WAN edge |
| Market-data SSM | `232.10.10.10` | enough for path | SSM + IGMPv3 + no WAN leak |

## Message / policy interaction

1. Source sets TTL = N.
2. Each routed hop decrements; at 0 the packet is dropped.
3. Independently, an interface **multicast boundary** may drop the group even when TTL remains.
4. L2 switches ignore IP TTL for flooding decisions.

## Configuration patterns

### Cisco IOS / IOS XE — boundary + TTL threshold (legacy)

```text
ip access-list standard SITE-MC
 permit 239.10.0.0 0.0.255.255
 deny   any
!
interface GigabitEthernet0/0
 description WAN edge
 ip multicast boundary SITE-MC
 ! optional legacy:
 ip multicast ttl-threshold 16
```

### Junos — scoped groups

```text
set policy-options prefix-list SITE-MC 239.10.0.0/16
set protocols pim interface ge-0/0/0.0 scoped-group SITE-MC
```

### Host TTL (Linux sender)

```text
# setsockopt IP_MULTICAST_TTL, or:
ip route add 232.10.10.10/32 dev eth0
# application should set TTL explicitly (e.g. 16), never rely on default 1 for routed plants
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **Admin scope `239/8`** | Needs real boundaries to mean anything |
| **SSM** | Still needs TTL + edge ACL to prevent WAN leak |
| **Snooping** | TTL-blind; huge VLAN ⇒ huge blast radius |
| **MSDP/MBGP** | Interdomain leak risk if scope not filtered |

## Verification

1. Source TTL=1: receiver on remote VLAN must fail; same VLAN may still work.
2. Raise TTL; confirm only intended hops see the packet.
3. Apply boundary: group denied even with high TTL.
4. Capture TTL at each hop to locate decrement surprises (tunnels).

```text
show ip multicast interface
show ip multicast boundary
tcpdump -nvvi eth0 host 232.10.10.10
```

## Risks

- Believing TTL=1 “contains” a campus-wide VLAN.
- Boundaries missing on one redundant WAN link → asymmetric leak.
- Copying production TTL into lab without matching diameter.

## Interview framing

“Scope is where the group is allowed; TTL is how far one packet can go—use both, and never trust TTL alone inside a large L2 domain.”

---
