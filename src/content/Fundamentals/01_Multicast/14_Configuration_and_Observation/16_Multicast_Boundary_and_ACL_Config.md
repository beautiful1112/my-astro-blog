# Multicast boundary and ACL configuration

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Boundaries limit which groups and `(S,G)` trees may cross an interface or domain edge. They complement—but do not replace—CoPP, uRPF, and host admission. Related theory: [Security controls](../13_Security/02_Controls.md), [three-level boundary](../13_Security/03_Boundary_Principle.md).

## Design prerequisites

```text
Allowed SSM:     (192.0.2.10, 232.10.10.10)
Allowed ASM:     239.10.0.0/16 inside plant
Scoped / site:   239.255.0.0/16 must not leave site
Blocked:         unexpected 232/8 and link-local control except needed PIM
Edge interface:  facing WAN or untrusted VRF
```

## Boundary ACL ideas

Typical filters:

- permit approved data groups (`232` / `239` allowlists);
- deny site-local scoped ranges outbound;
- optionally filter PIM Join/Prune by `(S,G)` or group on capable platforms;
- never confuse “deny data” with “PIM neighbors still need Hellos on `224.0.0.13`.”

## Cisco IOS / IOS XE

```text
ip access-list extended MCAST-BOUNDARY-OUT
 ! Permit approved SSM channel
 permit ip host 192.0.2.10 host 232.10.10.10
 ! Permit internal ASM range
 permit ip any 239.10.0.0 0.0.255.255
 ! Block site-scoped groups leaving
 deny   ip any 239.255.0.0 0.0.255.255
 deny   ip any any

interface GigabitEthernet0/1
 description plant edge
 ip address 198.51.100.1 255.255.255.252
 ip pim sparse-mode
 ip multicast boundary MCAST-BOUNDARY-OUT
```

`(S,G)` Join filters / PIM neighbor filters are platform-specific (`ip pim accept-register`, boundary with filter-autorp, route-maps). Apply Register allowlists on the RP:

```text
ip pim accept-register list REG-SOURCES
ip access-list extended REG-SOURCES
 permit ip 192.0.2.0 0.0.0.255 any
 deny   ip any any
```

## Junos

```text
set policy-options prefix-list ALLOWED-SSM 232.10.10.10/32
set policy-options policy-statement MCAST-SCOPE term allow-ssm from route-filter 232.10.10.10/32 exact
set policy-options policy-statement MCAST-SCOPE term allow-ssm then accept
set policy-options policy-statement MCAST-SCOPE term deny-scoped from route-filter 239.255.0.0/16 orlonger
set policy-options policy-statement MCAST-SCOPE term deny-scoped then reject
set policy-options policy-statement MCAST-SCOPE term allow-asm from route-filter 239.10.0.0/16 orlonger
set policy-options policy-statement MCAST-SCOPE term allow-asm then accept
set policy-options policy-statement MCAST-SCOPE term default then reject

set protocols pim interface ge-0/0/1.0 mode sparse
! Apply multicast scope / export policy using the platform form for
! interface scope or routing-instance multicast boundaries.
set routing-options multicast scope SITE prefix 239.255.0.0/16
```

Exact Junos scope and PIM import/export syntax varies by release—validate that both data plane and Join propagation honor the policy.

## FRRouting

```text
! Prefix-lists and route-maps gate RP maps / joins where supported.
ip prefix-list ALLOWED-GROUPS seq 5 permit 232.10.10.10/32
ip prefix-list ALLOWED-GROUPS seq 10 permit 239.10.0.0/16
ip prefix-list ALLOWED-GROUPS seq 15 deny 239.255.0.0/16
ip prefix-list ALLOWED-GROUPS seq 20 deny any
!
router
 ip multicast-routing
 ! Bind prefix-list to RP / join policy per FRR version docs
```

Confirm which FRR objects apply to OIL, Join, and Register; do not assume Cisco `ip multicast boundary` semantics.

## Scoped groups

Administratively scoped IPv4 multicast (`239.0.0.0/8`, with site/org conventions such as `239.255.0.0/16`) must stop at the documented edge. Boundary ACLs and TTL/Hop Limit work together; TTL alone is not a security boundary.

## CoPP note

Data-plane boundaries do not protect the route processor. Rate-limit PIM, IGMP, MSDP, and Register-carrying packets in CoPP / control-plane policing sized for legitimate churn plus headroom. A permit in the multicast boundary ACL is not a CoPP exemption plan.

```text
! Conceptual — platform CoPP policy must match CPU architecture
! class-map / policy-map matching pim, igmp, udp register paths
```

## Verification

```text
show ip multicast interface
show ip pim interface detail
show ip mroute 232.10.10.10
show ip access-lists MCAST-BOUNDARY-OUT
ping / traffic generator from unauthorized (S,G)
```

1. Approved `(192.0.2.10, 232.10.10.10)` crosses; counters increment.
2. `239.255.10.10` is dropped or not joined across the edge.
3. Unauthorized SSM source does not build OIL beyond the boundary.
4. PIM Hellos to `224.0.0.13` still sustain neighbors on the link.
5. CoPP drops show under Register/Join floods without killing Hellos.

## Failure tests

| Inject | Expect |
|---|---|
| Join for denied group | No upstream Join / no OIL across edge |
| Spoofed source in allowed group | uRPF or `(S,G)` filter drops |
| Auto-RP / BSR across edge | Blocked unless explicitly allowed |
| Over-tight ACL | Neighbor loss or broken discovery groups |
| CoPP too aggressive | Intermittent PIM adjacency / Register loss |

## Risks

- Filtering `224.0.0.13` or Auto-RP discovery while debugging “no neighbors.”
- Allowing all of `232/8` or `239/8` “temporarily” on a WAN edge.
- Boundary without CoPP—CPU exhaustion from Register or IGMP storms.
- Inconsistent ACLs left-to-right on redundant edges.

---
