# Minimal working configs

Side-by-side classic vs named for a small dual-router link plus optional stub spoke pattern. Same AS **100**, RID set, auto-summary off, one transit link.

## Classic — transit router A

```text
hostname R-A
!
interface Loopback0
 ip address 1.1.1.1 255.255.255.255
!
interface GigabitEthernet0/0
 ip address 192.0.2.1 255.255.255.252
!
interface GigabitEthernet0/1
 ip address 10.1.1.1 255.255.255.0
!
router eigrp 100
 network 1.1.1.1 0.0.0.0
 network 192.0.2.0 0.0.0.3
 network 10.1.1.0 0.0.0.255
 eigrp router-id 1.1.1.1
 no auto-summary
```

## Named — transit router A

```text
hostname R-A
!
interface Loopback0
 ip address 1.1.1.1 255.255.255.255
!
interface GigabitEthernet0/0
 ip address 192.0.2.1 255.255.255.252
!
interface GigabitEthernet0/1
 ip address 10.1.1.1 255.255.255.0
!
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  eigrp router-id 1.1.1.1
  network 1.1.1.1 0.0.0.0
  network 192.0.2.0 0.0.0.3
  network 10.1.1.0 0.0.0.255
  af-interface default
   passive-interface
  exit-af-interface
  af-interface GigabitEthernet0/0
   no passive-interface
  exit-af-interface
  af-interface GigabitEthernet0/1
   no passive-interface
  exit-af-interface
  topology base
  exit-af-topology
 exit-address-family
```

## Classic — stub spoke

```text
router eigrp 100
 network 10.2.0.0 0.0.255.255
 network 172.16.0.0 0.0.0.3
 eigrp stub connected summary
 no auto-summary
```

## Named — stub spoke

```text
router eigrp SPOKE
 address-family ipv4 unicast autonomous-system 100
  network 10.2.0.0 0.0.255.255
  network 172.16.0.0 0.0.0.3
  eigrp stub connected summary
  af-interface GigabitEthernet0/0
   no passive-interface
  exit-af-interface
  topology base
  exit-af-topology
 exit-address-family
```

## Sanity verification

```text
! Classic
show ip eigrp neighbors
show ip eigrp topology
show ip route eigrp

! Named
show eigrp address-family ipv4 neighbors
show eigrp address-family ipv4 topology
show ip route eigrp
```

Expect: adjacency up, Passive prefixes, stub peer flags on hub’s spoke neighbor.

## Interview framing

“Be able to rewrite a classic process into named AF/af-interface/topology without changing networks or AS.”

## Related

- [Named mode structure](01_Named_Mode_Structure.md)
- [Classic AS mode recap](02_Classic_AS_Mode_Recap.md)
- [Migrating classic to named](05_Migrating_Classic_to_Named.md)

---
