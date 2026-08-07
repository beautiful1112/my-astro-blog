# Routed PIM-SSM configuration patterns

These examples build one routed SSM channel from source `192.0.2.10` to group `232.10.10.10` across source VLAN 100, a PIM core, and receiver VLAN 200. Syntax is illustrative; confirm platform/release support before deployment.

## Design prerequisites

```text
Source:       192.0.2.10/24 on VLAN 100
Receiver:     VLAN 200
SSM range:    232.0.0.0/8
Membership:   IGMPv3 INCLUDE(192.0.2.10)
Core:         source prefix reachable in MRIB, PIM on every routed hop
Policy:       permit only approved (S,G) and receiver VLANs
```

## Cisco IOS-like pattern

```text
ip multicast-routing

ip access-list standard SSM-RANGE
 permit 232.0.0.0 0.255.255.255

ip pim ssm range SSM-RANGE

interface Vlan100
 description SSM source LAN
 ip address 192.0.2.1 255.255.255.0
 ip pim sparse-mode

interface Port-channel10
 description Routed PIM core link
 ip address 198.51.100.1 255.255.255.252
 ip pim sparse-mode

interface Vlan200
 description SSM receiver LAN
 ip address 198.51.200.1 255.255.255.0
 ip pim sparse-mode
 ip igmp version 3
```

The source-facing interface does not require IGMP merely because a source transmits there. The receiver-facing interface requires IGMPv3 to learn `S` natively.

## Junos-like pattern

```text
set protocols pim interface irb.100
set protocols pim interface ae10.0
set protocols pim interface irb.200
set protocols igmp interface irb.200 version 3
```

Sparse interface mode also supports SSM groups. The standard IPv4 range is `232.0.0.0/8`; configure any nonstandard SSM range consistently using the platform's supported group policy.

## Routing and RPF

The LHR and every transit router must resolve the source prefix:

```text
show ip rpf 192.0.2.10
show route 192.0.2.10
show multicast rpf 192.0.2.10
```

If a multicast-specific topology is required, install the source prefix through multicast BGP SAFI or a deliberate static mroute. Do not configure an RP for the SSM group.

## Source and receiver admission

Production policy should specify:

- source ports/VLANs allowed to originate `192.0.2.10`;
- uRPF/source ACL against source spoofing;
- receiver interfaces allowed to Join `232.10.10.10`;
- `(S,G)` PIM Join boundaries;
- snooping group/source limits;
- TTL/Hop Limit and data-plane boundaries.

SSM matches an IP source address; it does not cryptographically authenticate the sender.

## Verification sequence

1. receiver sends IGMPv3 `INCLUDE {192.0.2.10}` for `232.10.10.10`;
2. access switch programs listener and mrouter ports;
3. LHR creates `(192.0.2.10,232.10.10.10)` with receiver OIF;
4. PIM Join travels toward `192.0.2.10` on the selected RPF path;
5. source-side router forwards native data—no Register appears;
6. all routers show source-facing IIF and expected OIL;
7. MFIB and interface counters increment without RPF drops.

Negative checks are equally important: no `(*,G)`, RP mapping, Register, or MSDP state should be required for this group.

## Failure tests

- change source route/ECMP next hop;
- fail one PIM neighbor;
- send from an unauthorized source address;
- issue a group-only IGMPv2 join;
- age out the snooping querier;
- exhaust a source-specific hardware entry limit;
- fail the source-side routed link while the source host remains transmitting.

Measure sequence loss, Join movement, RPF change, and MFIB reprogramming—not only final recovery.
