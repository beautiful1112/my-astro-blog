# IPv4 multicast address space

IPv4 multicast is **`224.0.0.0/4`** (`224.0.0.0` through `239.255.255.255`). Treat the space as a registry, not a free-for-all—collisions and wrong scope cause silent cross-talk.

## Important blocks

| Range | Meaning |
|---|---|
| `224.0.0.0/24` | Local Network Control; routers do **not** forward regardless of TTL |
| `224.0.1.0/24` | Internetwork Control; not inherently link-local |
| `232.0.0.0/8` | Standard IPv4 **SSM** range (RFC 4607) |
| `233.252.0.0/24` | Documentation / test examples |
| `234.0.0.0/8` | Unicast-prefix-based allocation (GLOP-style / RFC 6034 family) |
| `239.0.0.0/8` | Administratively scoped organization-local space |

An application channel is typically identified by **source + group + UDP port + environment + feed + line**—not by group alone.

Related: [Scope and TTL](02_Scope_and_TTL.md), [Well-known control groups](05_Well_Known_Control_Groups.md), [ASM and SSM](../03_Service_Models_and_Terminology/02_ASM_and_SSM.md).

## Addressing plan practices

| Practice | Why |
|---|---|
| Separate SSM (`232/8`) from ASM (`239/8`) | Different control-plane requirements |
| Per-environment prefixes | Prevent lab from joining prod trees |
| Per-feed / per-line encoding in the third/fourth octets | Operational clarity |
| Document owner and TTL/boundary | Audit and incident response |

## Configuration patterns

### Cisco IOS / IOS XE — SSM range + boundary

```text
ip access-list standard SSM-RANGE
 permit 232.0.0.0 0.255.255.255
ip pim ssm range SSM-RANGE
!
ip access-list standard MD-BOUNDARY
 deny   239.0.0.0 0.255.255.255
 permit any
!
interface GigabitEthernet0/0
 ip multicast boundary MD-BOUNDARY
```

### Junos

```text
set routing-options multicast ssm-groups 232.0.0.0/8
set policy-options prefix-list MD-SCOPE 239.10.0.0/16
set protocols pim interface ge-0/0/0.0 scoped-group MD-SCOPE
```

### FRRouting

```text
ip pim ssm prefix-list SSM
ip prefix-list SSM permit 232.0.0.0/8
!
! Boundary / ACL syntax is platform NOS dependent on the box
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **SSM** | Expect channels in `232/8` |
| **RP ACL** | Should cover ASM groups only |
| **Ethernet mapping** | 32 IP groups → one MAC; plan to reduce alias pain |
| **TTL / boundary** | Address scope ≠ packet TTL |

## Verification

1. Confirm app uses the documented group (not a “random” `224.0.0.x`).
2. `232/8` traffic never requires RP mapping.
3. Boundary interface counters drop out-of-scope groups.
4. Registry lists source, group, port, owner.

```text
show ip pim rp mapping
show ip multicast boundary
show ip mroute 232.10.10.10
```

## Risks

- Using link-local `224.0.0.0/24` for application data (never routed).
- Reusing one group across A/B lines without source separation.
- No registry → two teams collide on `239.1.1.1`.

## Interview framing

“IPv4 multicast is 224/4; remember link-local 224.0.0.0/24 is not forwarded, 232/8 is SSM, and 239/8 is admin-scoped—channels need a registry, not just a group.”

---
