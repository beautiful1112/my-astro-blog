# EIGRP for IPv6 fundamentals

EIGRP for IPv6 uses the same **DUAL**, K-values, FS/FC, stub, and summarization concepts as IPv4. Differences are mostly **transport, addressing, and CLI**: IPv6 link-local neighbor formation, no `network` statement in classic IPv6 mode (interfaces enabled for EIGRP IPv6), and named-mode address-family ipv6.

## What stays the same

- Feasibility condition, successor/FS, Active/Query/SIA
- Stub and summarization as query boundaries
- Variance / maximum-paths
- Metric formula with K-values (must still match AS-wide)

## What changes

| Topic | IPv6 behavior |
|---|---|
| Neighbor address | Typically **link-local** on the interface |
| Classic enable | `ipv6 router eigrp` + `ipv6 eigrp <AS>` on interfaces |
| Named enable | `address-family ipv6 unicast autonomous-system` |
| Router ID | **Required** 32-bit RID (next lesson) |
| Summaries | IPv6 summary prefixes under AF/interface |

```text
R1 Gi0/0 --EIGRP IPv6 / link-local nbr--> R2 Gi0/0
A --advertise globals / 2001:db8:1::/64--> B
```

## Multicast / protocol

EIGRP remains IP protocol **88**. IPv6 uses appropriate multicast groups for hellos (implementation detail—verify with `show ipv6 eigrp` / AF shows). ACLs must allow EIGRP on IPv6 as well as IPv4 in dual-stack ACLs.

## Advertised prefixes vs neighbor address

Neighbors form over **link-local**, but topology entries advertise **global** (or ULA) prefixes with metrics. Next-hop resolution for the RIB uses the link-local next hop on the outgoing interface—same mental model as OSPFv3.

```text
show ipv6 eigrp neighbors
! H Address                 Interface
!   FE80::2                 Gi0/0
show ipv6 route 2001:DB8:1::/64
! via FE80::2, GigabitEthernet0/0
```

## Ops baseline

1. `ipv6 unicast-routing` enabled.
2. RID configured; classic process not shut.
3. Interfaces in the AF / `ipv6 eigrp <AS>` as appropriate.
4. Hellos not blocked by IPv6 ACL or RA-guard oddities on switches.
5. K-values match the IPv4 AS if you expect symmetric dual-stack behavior.

## Risks

- Dual-stack with only IPv4 stub/summary → IPv6 SIA under failure.
- Assuming `network` statements from IPv4 classic apply to IPv6—they do not.
- Filtering IPv6 EIGRP in infrastructure ACLs while allowing ICMPv6 only.

## Interview framing

“Same DUAL, different CLI and link-local neighbors; RID mandatory; prefer named AF ipv6 for dual-stack.”

## Related

- [Router ID requirement](02_Router_ID_Requirement.md)
- [Named mode IPv6](03_Named_Mode_IPv6.md)
- [DUAL overview](../08_DUAL_and_Feasibility/01_DUAL_Overview.md)
- [Dual stack design notes](05_Dual_Stack_Design_Notes.md)

---
