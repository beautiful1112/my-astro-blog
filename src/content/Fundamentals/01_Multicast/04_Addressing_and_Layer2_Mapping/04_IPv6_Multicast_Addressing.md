# IPv6 multicast addressing

IPv6 multicast is **`ff00::/8`**. Flags and scope live in the second byte; the rest is the group ID. Neighbor Discovery depends on link-scoped multicast—broken MLD snooping can break ordinary IPv6 unicast.

## Format

```text
| 8 bits FF | 4-bit flags 0RPT | 4-bit scope | 112-bit group ID |
```

| Field | Meaning |
|---|---|
| `T` flag | 0 = well-known; 1 = transient |
| `P` / `R` flags | unicast-prefix-based / embedded-RP related (see RFCs) |
| Scope nibble | where the group is valid |

Common scopes: interface-local `1`, link-local `2`, admin-local `4`, site-local `5`, organization-local `8`, global `e`.

**IPv6 SSM** uses **`ff3x::/32`**, where `x` is the scope (e.g. `ff38::/32` org-local SSM).

## Ethernet mapping

IPv6 multicast maps to `33:33:` plus the **low 32 bits** of the IPv6 destination—again many-to-one aliases.

```text
ff02::1:ff00:1234  →  33:33:ff:00:12:34
```

Related: [Well-known control groups](05_Well_Known_Control_Groups.md), [MLD for IPv6](../05_IGMP_and_MLD/07_MLD_for_IPv6.md), [MLDv2 formats](../05_IGMP_and_MLD/23_MLDv2_Query_and_Report_Formats.md).

## Solicited-node and ND

Solicited-node groups live in `ff02::1:ff00:0/104`. Hosts join them for Neighbor Discovery. If MLD snooping drops these incorrectly, IPv6 NA/NS breaks even with no user application multicast.

## Configuration patterns

### Cisco IOS / IOS XE

```text
ipv6 multicast-routing
!
interface GigabitEthernet0/1
 ipv6 address 2001:db8:1::1/64
 ipv6 pim
 ipv6 mld version 2
!
ipv6 pim ssm range DEFAULT
! SSM ff3x::/32 typically
```

### Junos

```text
set protocols pim interface ge-0/0/1.0 mode sparse family inet6
set protocols mld interface ge-0/0/1.0 version 2
set routing-options multicast ssm-groups ff3e::/32
```

### FRRouting

```text
ipv6 pim
!
interface eth1
 ipv6 pim
 ipv6 mld
```

### Linux host

```text
# Join via IPV6_ADD_MEMBERSHIP / MCAST_JOIN_SOURCE_GROUP
ip -6 maddr show
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **MLD snooping** | Must flood/query correctly or ND dies |
| **Embedded-RP** | RP address can be encoded in group (ASM) |
| **PIM for IPv6** | Separate from IPv4 PIM state |
| **Scope** | `ff02::` never leaves the link |

## Verification

1. `ff02::1` / `ff02::2` present on-link; routers answer RAs.
2. Solicited-node groups visible in MLD membership for host addresses.
3. SSM `ff3x::` channel shows `(S,G)` without RP.
4. Capture Ethernet DA `33:33:…` matches low 32 bits.

```text
show ipv6 mld groups
show ipv6 pim join
show ipv6 mroute
```

## Risks

- Enabling aggressive MLD snooping without router ports → ND blackhole.
- Treating IPv6 multicast as “same as IPv4 with bigger addresses.”
- Using global scope groups without edge filters.

## Interview framing

“IPv6 multicast is ff00::/8 with an explicit scope nibble; SSM is ff3x::/32; Ethernet uses 33:33 plus low 32 bits; and MLD snooping mistakes break Neighbor Discovery.”

---
