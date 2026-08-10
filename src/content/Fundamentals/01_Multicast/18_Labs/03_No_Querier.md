# Lab 3: No-querier failure

Demonstrate that snooping without a querier works briefly then blackholes receivers.

## Topology

```text
Receiver -- switch VLAN 100 (snooping ON, no querier) -- isolated
Later: add snooping querier or L3 IGMP querier on SVI
```

Addresses: group `239.10.10.10`, sender `192.0.2.10`, receiver `192.0.2.20`.

## Objectives

- Show initial delivery after a Report.
- Show failure after snooping timeouts with no Queries.
- Prove querier restoration recovers listener state after re-join/query cycle.

## Config touchpoints

```text
! Isolated VLAN — snooping enabled, no PIM/IGMP querier initially
ip igmp snooping
! Restore:
ip igmp snooping querier
! or
interface Vlan100
 ip address 198.51.100.1 255.255.255.0
 ip igmp version 3
```

## Tasks

1. Enable snooping on an isolated VLAN with no querier.
2. Start sender and receiver join; confirm data.
3. Wait for membership/snooping timers (document platform defaults).
4. Observe traffic stop while sender still transmits.
5. Add a snooping querier or L3 querier; re-join if required; prove Queries preserve state.

## Failure injection

- Querier election conflict: two queriers with different subnets—note which wins (lowest IPv4).
- Storm-control on Queries—simulate “works then dies” under load.

## Expected evidence

```text
t0: Report, snooping entry, data OK
t_expire: entry gone, data flooded or dropped per platform policy — receiver silent
t_fix: Queries periodic, state refreshed, data OK
```

```text
show ip igmp snooping groups vlan 100
show ip igmp snooping querier
tcpdump -ni eth0 -vv igmp
```

## Cross-links

[Same VLAN no router](../16_Practical_Cases/01_Same_VLAN_No_Router.md), [L2 snooping config](../14_Configuration_and_Observation/08_L2_Snooping_Configuration_Patterns.md).

---
