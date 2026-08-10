# IGMP and MLD configuration patterns

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Membership configuration sits on last-hop routed interfaces (and optionally on L2 queriers). This page covers **version pinning**, **timer tuning**, **static joins**, **proxy**, and **SSM mapping** sketches. Theory lives in [05 IGMP and MLD](../05_IGMP_and_MLD/README.md); L2 querier/mrouter examples are in [08 L2 snooping config](08_L2_Snooping_Configuration_Patterns.md).

## Design prerequisites

```text
Receiver VLAN:     200 / irb.200
Querier / LHR:     198.51.100.1
SSM channel:       (192.0.2.10, 232.10.10.10)
ASM example group: 239.10.10.10
Robustness:        2 (default-ish); raise on lossy access
Query interval:    125s default; lower only with scale math
```

## Version pinning

### Cisco IOS / IOS XE

```text
interface Vlan200
 ip address 198.51.100.1 255.255.255.0
 ip pim sparse-mode
 ip igmp version 3
 ! For IPv6:
 ipv6 mld version 2
```

### Junos

```text
set protocols igmp interface irb.200 version 3
set protocols mld interface irb.200 version 2
```

### FRRouting

```text
interface vlan200
 ip igmp
 ip igmp version 3
 ipv6 mld
```

Pin **v3/v2** on SSM receiver LANs. Mixed-version LANs fall back per RFC compatibility rules—verify with a capture, not intent.

## Query and last-member timers

### Cisco-like

```text
interface Vlan200
 ip igmp query-interval 30
 ip igmp query-max-response-time 10
 ip igmp last-member-query-interval 100
 ip igmp last-member-query-count 2
 ip igmp robustness-variable 3
```

### Junos

```text
set protocols igmp interface irb.200 query-interval 30
set protocols igmp interface irb.200 query-response-interval 10
set protocols igmp interface irb.200 robust-count 3
```

Lowering query interval increases control traffic and state churn. Document the math: membership timeout ≈ robustness × query-interval + query-response.

## Static joins

Use for labs or appliances that cannot signal; remove before production handoff unless explicitly owned.

### Cisco-like

```text
interface Vlan200
 ip igmp static-group 239.10.10.10
 ip igmp join-group 232.10.10.10 source 192.0.2.10
 ! join-group may pull traffic to the CPU — know the semantics
```

### Junos

```text
set protocols igmp interface irb.200 static group 239.10.10.10
set protocols igmp interface irb.200 static group 232.10.10.10 source 192.0.2.10
```

### FRRouting

```text
interface vlan200
 ip igmp join 239.10.10.10
```

## IGMP proxy (access tree)

### Cisco-like sketch

```text
ip igmp proxy-service
!
interface GigabitEthernet0/0
 description upstream toward PIM domain
 ip igmp proxy upstream
!
interface GigabitEthernet0/1
 description downstream hosts
 ip igmp proxy downstream
```

Proxy aggregates downstream membership into upstream reports. It is **not** a substitute for PIM in arbitrary routed topologies. See [Static joins and IGMP proxy](../05_IGMP_and_MLD/08_Static_Joins_and_IGMP_Proxy.md).

## SSM mapping (IGMPv2 → SSM)

When hosts can only send group joins but the plant is SSM:

### Cisco-like

```text
ip igmp ssm-map enable
ip igmp ssm-map static 192.0.2.10 232.10.10.10
! or DNS-based mapping where supported
interface Vlan200
 ip igmp version 2
```

### Junos

```text
set protocols igmp ssm-map MAP1 source 192.0.2.10
set protocols igmp ssm-map MAP1 group 232.10.10.10/32
set protocols igmp interface irb.200 ssm-map-policy MAP1
```

Treat mapped `S` as **policy**, not host truth. Document ownership.

## Verification sequence

1. `show ip igmp interface` / `show igmp interface` — version, timers, querier.
2. Host joins — `show ip igmp groups detail` shows filter mode and sources.
3. Capture — IGMPv3 reports to `224.0.0.22`; queries from elected querier.
4. Leave — LMQ process or immediate-leave policy as designed.
5. Static join — OIL/PIM state without host report; remove and confirm teardown.
6. SSM map — IGMPv2 join produces `(S,G)` upstream; wrong map ⇒ wrong tree.

```text
show ip igmp interface Vlan200
show ip igmp groups detail
show ip igmp ssm-map
show ipv6 mld groups
tcpdump -ni eth0 igmp
tcpdump -ni eth0 icmp6
```

## Failure tests

| Inject | Expect |
|---|---|
| Two queriers | Lower IP (v2 rules) wins; no flapping |
| Version mismatch | Compatibility mode; SSM filters may be lost |
| Kill querier | Backup takes over before membership timeout |
| Wrong SSM map | Join to incorrect source tree |
| Leave static join in prod | Traffic persists after hosts stop |

## Risks

- Global immediate leave on shared access ports.
- Query-interval tuning without scale testing.
- Proxy or static joins masking broken host stacks.
- SSM mapping drift when DNS/static sources change.

## Cross-links

- [Queries and timers](../05_IGMP_and_MLD/04_Queries_and_Timers.md)
- [Querier election](../05_IGMP_and_MLD/05_Querier_Election_and_Failure.md)
- [Version compatibility](../05_IGMP_and_MLD/06_Version_Compatibility.md)
- [PIM-SSM config](03_PIM_SSM_Config_Pattern.md)

---
