# MBGP multicast-RPF configuration pattern

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Two autonomous systems exchange multicast reachability for source prefix `192.0.2.0/24` over `203.0.113.0/30`. Ordinary unicast may use a different peer/path.

## Cisco IOS-like example

```text
ip prefix-list MCAST-SOURCES seq 10 permit 192.0.2.0/24

route-map MCAST-IN permit 10
 match ip address prefix-list MCAST-SOURCES
route-map MCAST-IN deny 100

route-map MCAST-OUT permit 10
 match ip address prefix-list MCAST-SOURCES
route-map MCAST-OUT deny 100

router bgp 65010
 neighbor 203.0.113.2 remote-as 65020

 address-family ipv4 multicast
  network 192.0.2.0 mask 255.255.255.0
  neighbor 203.0.113.2 activate
  neighbor 203.0.113.2 route-map MCAST-IN in
  neighbor 203.0.113.2 route-map MCAST-OUT out
  neighbor 203.0.113.2 maximum-prefix 100 80
 exit-address-family

interface Ethernet0/0
 ip address 203.0.113.1 255.255.255.252
 ip pim sparse-mode
```

The `network` prefix must satisfy the platform's route-origination rule. Do not advertise every unicast prefix automatically into the multicast family.

## Junos-like session and policy

```text
set policy-options policy-statement MCAST-IN term ALLOW-SOURCES from route-filter 192.0.2.0/24 exact
set policy-options policy-statement MCAST-IN term ALLOW-SOURCES then accept
set policy-options policy-statement MCAST-IN term REJECT then reject

set protocols bgp group MCAST-EBGP type external
set protocols bgp group MCAST-EBGP family inet multicast
set protocols bgp group MCAST-EBGP peer-as 65020
set protocols bgp group MCAST-EBGP neighbor 203.0.113.2
set protocols bgp group MCAST-EBGP import MCAST-IN
set protocols pim interface ge-0/0/0.0
```

Configure the export policy and route-table/RIB-group integration required to originate the local source prefix for the particular Junos design. Verify which multicast RPF table receives the route.

## Why PIM is on the peering link

BGP chooses the multicast topology, but PIM builds the tree. If the selected SAFI-2 next hop resolves over `Ethernet0/0`, that link must permit PIM protocol 103 and multicast data. A BGP-only interconnect produces a route with no usable upstream PIM neighbor.

## Verification

```text
show bgp ipv4 multicast summary
show ip bgp ipv4 multicast 192.0.2.0
show route table <multicast-rpf-table> 192.0.2.0/24
show ip rpf 192.0.2.10
show pim neighbor
show multicast route 192.0.2.10 232.10.10.10
```

Confirm:

1. multicast AFI/SAFI capability negotiated;
2. prefix received/advertised and policy counters match;
3. best path and next hop are expected;
4. prefix entered MRIB;
5. RPF neighbor is the PIM peer;
6. `(S,G)` Join crosses the link;
7. returning data arrives on the selected IIF.

## Failure drill

Withdraw only the multicast route while leaving unicast up. Measure BGP withdrawal, MRIB change, PIM Join movement, data loss, and old-state pruning. This proves the topology is genuinely independent.
