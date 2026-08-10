# Classic IPv6 router EIGRP

Classic IPv6 EIGRP uses a separate process: **`ipv6 router eigrp <AS>`**. Interfaces are enabled with **`ipv6 eigrp <AS>`**. Historically the IPv6 EIGRP process starts in **shutdown** state and must be explicitly enabled with **`no shutdown`**.

## Minimal classic IPv6

```text
ipv6 unicast-routing
!
interface GigabitEthernet0/0
 ipv6 address 2001:DB8:1::1/64
 ipv6 eigrp 100
!
ipv6 router eigrp 100
 eigrp router-id 1.1.1.1
 no shutdown
 stub connected summary
```

Without `no shutdown`, neighbors never form—top interview/ops gotcha on older curricula and images that retain this default.

## Interface-centric enablement

There is no IPv4-style `network` statement selecting interfaces by address range. You enable EIGRP IPv6 **per interface**. Passive interfaces / stub still apply at the process as supported.

## Summarization (classic IPv6)

```text
interface GigabitEthernet0/1
 ipv6 summary-address eigrp 100 2001:DB8:10::/48
```

Exact syntax varies slightly by release; confirm with feature docs.

## Parallel with IPv4 classic

```text
router eigrp 100          ! IPv4
ipv6 router eigrp 100     ! IPv6 — separate process stanza
```

Same AS number is conventional. Two processes to monitor.

## Verification

```text
show ipv6 eigrp neighbors
show ipv6 eigrp topology
show ipv6 route eigrp
show ipv6 protocols
```

## Interview framing

“Classic IPv6: ipv6 router eigrp, per-interface ipv6 eigrp AS, RID required, process often needs no shutdown.”

## Related

- [Router ID requirement](02_Router_ID_Requirement.md)
- [Named mode IPv6](03_Named_Mode_IPv6.md)
- [IPv6 verification](06_IPv6_Verification.md)

---
