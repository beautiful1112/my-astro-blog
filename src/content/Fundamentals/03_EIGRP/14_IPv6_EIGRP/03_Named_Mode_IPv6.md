# Named mode IPv6

Named mode is the preferred way to run EIGRP for IPv6 alongside IPv4 under one process name with a dedicated **address-family ipv6**.

## Skeleton

```text
router eigrp CORP
 !
 address-family ipv4 unicast autonomous-system 100
  eigrp router-id 1.1.1.1
  network 192.0.2.0 0.0.0.3
  af-interface GigabitEthernet0/0
   no passive-interface
  exit-af-interface
  topology base
  exit-af-topology
 exit-address-family
 !
 address-family ipv6 unicast autonomous-system 100
  eigrp router-id 1.1.1.1
  af-interface GigabitEthernet0/0
   no passive-interface
  exit-af-interface
  topology base
   maximum-paths 4
  exit-af-topology
 exit-address-family
```

IPv6 AF commonly uses **af-interface** to enable participation (no classic `network` statement). Some releases also support `network`/`ipv6 eigrp` style under AF—prefer the documented form for your image.

## Summaries and stub

```text
 address-family ipv6 unicast autonomous-system 100
  eigrp stub connected summary
  af-interface GigabitEthernet0/1
   summary-address 2001:DB8:10::/48
  exit-af-interface
```

Stub/query-domain rules match IPv4.

## AS number choice

Using the **same AS** for IPv4 and IPv6 AFs is common and simplifies ops. Different ASNs are possible but rarely needed—document if split.

## Verification

```text
show eigrp address-family ipv6 neighbors
show eigrp address-family ipv6 topology
show ipv6 route eigrp
```

## Interview framing

“Named dual-stack = two AFs, shared process name, RID in each AF, af-interface enables IPv6 links.”

## Related

- [Named mode structure](../13_Named_Mode_and_Configuration/01_Named_Mode_Structure.md)
- [Dual stack design notes](05_Dual_Stack_Design_Notes.md)
- [Router ID requirement](02_Router_ID_Requirement.md)

---
