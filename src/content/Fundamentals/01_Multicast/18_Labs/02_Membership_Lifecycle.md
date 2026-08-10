# Lab 2: Membership lifecycle

Observe IGMP/MLD state creation, query response, and leave behavior end to end.

## Topology

```text
Receiver -- access switch (snooping) -- LHR/querier -- (optional) PIM router
Tap on access port and on mrouter uplink
```

Use ASM `239.10.10.10` and SSM `232.10.10.10` with source `192.0.2.10`.

## Objectives

- Distinguish unsolicited reports, general queries, and group-specific queries.
- Compare host, switch snooping, and router membership tables.
- Contrast ASM join with IGMPv3 INCLUDE.

## Config touchpoints

```text
! Cisco sketch
ip igmp snooping
interface Vlan100
 ip igmp version 3
 ip pim sparse-mode
```

## Tasks

1. Capture IGMP on the access port.
2. Join ASM `239.10.10.10`; identify unsolicited reports.
3. Observe General Queries and randomized response delay.
4. Leave; observe group-specific queries (and last-member query count).
5. Repeat with IGMPv3 source-specific INCLUDE for `(192.0.2.10, 232.10.10.10)`.
6. Compare `/proc/net/igmp`, snooping groups, and `show ip igmp groups`.

## Failure injection

- Enable fast leave with two receivers behind a hub/dumb switch; remove one—observe blackhole risk.
- Block Queries only; confirm eventual state expiry.

## Expected evidence

```text
Join -> Report on wire -> snooping entry -> router group entry
Leave -> Group-Specific Query -> state expiry if no response
IGMPv3 INCLUDE carries source list for SSM
```

```text
tcpdump -ni eth0 -vv igmp
show ip igmp snooping groups
show ip igmp groups
cat /proc/net/igmp
```

## Cross-links

[IGMP/MLD config](../14_Configuration_and_Observation/13_IGMP_MLD_Config_Patterns.md), [Fast leave case](../16_Practical_Cases/05_Fast_Leave_Blackhole.md), [Control from receiver](../15_Troubleshooting/02_Control_State_From_Receiver.md).

---
