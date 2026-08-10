# Address families overview

In **named mode**, EIGRP configuration is organized by **address family (AF)**: typically **IPv4 unicast** and **IPv6 unicast**, each with its own autonomous-system number, networks/interfaces, topology tables, and neighbors. Think “one EIGRP instance per AF (and per VRF AF)” rather than a single mixed pot.

## What an AF owns

| Per AF | Examples |
|---|---|
| AS number | `autonomous-system 100` |
| Router-ID | Often set per AF |
| Neighbor table | IPv4 neighbors ≠ IPv6 neighbors |
| Topology / RIB contribution | IPv4 prefixes vs IPv6 prefixes |
| Stub, summary, SAFs | Applied in that AF context |
| Metrics / K-values | Must match peers in that AF |

```text
router eigrp CAMPUS
  AF ipv4 unicast AS 100  -> 224.0.0.10 neighbors
  AF ipv6 unicast AS 100  -> FF02::A neighbors
```

AS numbers may match across AFs for operational sanity, but IPv4 and IPv6 adjacencies are still **separate**. Related: [Multicast addresses](../04_Packets_and_Transport/08_Multicast_Addresses.md), [Router ID](04_Router_ID.md).

## Classic mode contrast

Classic IPv4 uses `router eigrp <as>`. IPv6 EIGRP historically used `ipv6 router eigrp <as>`. Named mode unifies the story under one process name with AF stanzas—prefer named for dual-stack designs.

## Configuration patterns

### Cisco IOS / IOS XE — dual stack named

```text
router eigrp CAMPUS
 !
 address-family ipv4 unicast autonomous-system 100
  network 10.0.0.0 0.0.255.255
  eigrp router-id 192.0.2.1
 exit-address-family
 !
 address-family ipv6 unicast autonomous-system 100
  eigrp router-id 192.0.2.1
  af-interface GigabitEthernet0/0
   no shutdown
  exit-af-interface
 exit-address-family
```

IPv6 often enables EIGRP on interfaces via `af-interface` / `ipv6 eigrp` style depending on release—verify platform docs in the lab you run.

### FRRouting / Junos

Do not assume AF parity with Cisco named EIGRP. Use Cisco for AF study labs.

## Verification

```text
show eigrp address-family ipv4 neighbors
show eigrp address-family ipv6 neighbors
show eigrp address-family ipv4 topology
show ipv6 route eigrp
```

Lab checks:

1. Bring up IPv4 neighbors only; confirm IPv6 AF empty.
2. Break IPv6 RID; observe IPv6 AF failure while IPv4 survives.
3. Different AS under IPv6 AF; prove no IPv6 adjacency.

## Risks

- Assuming one neighbor table covers both stacks.
- Setting RID only for IPv4 and wondering why IPv6 EIGRP stays down.
- Redistributing “EIGRP” without specifying AF/VRF context.

## Interview framing

“Named-mode EIGRP runs separate IPv4 and IPv6 unicast address families—each with its own AS context, neighbors, and topology—so dual-stack means two adjacency planes, not one.”

---
