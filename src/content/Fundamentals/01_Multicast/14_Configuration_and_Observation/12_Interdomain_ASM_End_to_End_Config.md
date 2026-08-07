# Interdomain ASM end-to-end configuration pattern

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

This annotated Cisco IOS-like example combines local PIM-SM, multicast SAFI BGP, interdomain PIM, and MSDP. It is a study pattern, not a paste-ready production configuration.

## Topology

```text
AS 65010                                      AS 65020
S 192.0.2.10 -- RP-A/Border-A ============== RP-B/Border-B -- Receiver
                 Lo0 10.255.1.1   transit       Lo0 10.255.2.1
                 203.0.113.1/30                 203.0.113.2/30

Group: 239.10.10.10
Local RP in AS65010: 10.255.1.1
Local RP in AS65020: 10.255.2.1
```

RP loopbacks are unique addresses here, not Anycast. Ordinary unicast routing must make the two loopbacks reachable for MSDP TCP and peer-RPF processing.

## RP-A / source AS

```text
ip multicast-routing

ip access-list standard ASM-GROUPS
 permit 239.10.0.0 0.0.255.255

ip pim rp-address 10.255.1.1 group-list ASM-GROUPS

interface Loopback0
 ip address 10.255.1.1 255.255.255.255

interface Vlan100
 description Source LAN
 ip address 192.0.2.1 255.255.255.0
 ip pim sparse-mode

interface Ethernet0/0
 description PIM and MBGP inter-AS link
 ip address 203.0.113.1 255.255.255.252
 ip pim sparse-mode

router bgp 65010
 neighbor 203.0.113.2 remote-as 65020
 address-family ipv4 multicast
  network 192.0.2.0 mask 255.255.255.0
  neighbor 203.0.113.2 activate
  neighbor 203.0.113.2 route-map MCAST-OUT out
 exit-address-family

ip msdp originator-id Loopback0
ip msdp peer 10.255.2.1 connect-source Loopback0
ip msdp sa-filter out 10.255.2.1 route-map SA-OUT
ip msdp sa-filter in 10.255.2.1 route-map SA-IN
```

`MCAST-OUT` should permit only authorized source/RP prefixes. `SA-OUT` should permit only approved `(source prefix, ASM group range)` advertisements.

## RP-B / receiver AS

```text
ip multicast-routing

ip access-list standard ASM-GROUPS
 permit 239.10.0.0 0.0.255.255

ip pim rp-address 10.255.2.1 group-list ASM-GROUPS

interface Loopback0
 ip address 10.255.2.1 255.255.255.255

interface Ethernet0/0
 description PIM and MBGP inter-AS link
 ip address 203.0.113.2 255.255.255.252
 ip pim sparse-mode

interface Vlan200
 description Receiver LAN
 ip pim sparse-mode
 ip igmp version 3

router bgp 65020
 neighbor 203.0.113.1 remote-as 65010
 address-family ipv4 multicast
  neighbor 203.0.113.1 activate
  neighbor 203.0.113.1 route-map MCAST-IN in
  neighbor 203.0.113.1 maximum-prefix 100 80
 exit-address-family

ip msdp originator-id Loopback0
ip msdp peer 10.255.1.1 connect-source Loopback0
ip msdp sa-filter in 10.255.1.1 route-map SA-IN
ip msdp sa-filter out 10.255.1.1 route-map SA-OUT
```

`MCAST-IN` permits `192.0.2.0/24` so RP-B's MRIB can build an RPF path toward `S`. The inter-AS interface runs PIM because BGP supplies topology but PIM carries the `(S,G)` Join.

## Expected state sequence

1. source registers to local RP-A;
2. RP-A originates MSDP SA for `(192.0.2.10,239.10.10.10)`;
3. RP-B receives/accepts SA;
4. receiver Report creates `(*,G)` toward RP-B;
5. RP-B uses multicast BGP route `192.0.2.0/24` to send `(S,G)` Join across `203.0.113.0/30`;
6. native data returns from AS65010 to AS65020;
7. receiver LHR may switch to source tree while its local RP remains the ASM discovery anchor.

## Validation commands

```text
show ip bgp ipv4 multicast 192.0.2.0
show ip rpf 192.0.2.10
show ip pim neighbor
show ip msdp peer
show ip msdp sa-cache
show ip pim rp mapping 239.10.10.10
show ip mroute 239.10.10.10 192.0.2.10
```

## Production additions

- unicast routing and filtering for RP loopbacks/MSDP endpoints;
- TCP/639 authentication/protection where supported;
- PIM neighbor/Join and data-plane source/group boundaries;
- SA filters in both directions with explicit final deny;
- BGP prefix limits and route-policy counters;
- CoPP sized for PIM, Registers, MSDP, and BGP;
- RP and peer redundancy designed as an end-to-end service;
- monitoring for new source, new receiver, SA reject, RPF change, and data sequence loss.

Break MBGP, MSDP, PIM, and data policy one at a time. All four can produce “no data,” but their state evidence is different.
