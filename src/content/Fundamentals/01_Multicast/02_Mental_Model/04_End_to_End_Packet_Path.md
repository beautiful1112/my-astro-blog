# End-to-end packet path

For UDP from `192.0.2.10` to `232.10.10.10:15000`, every hop is a distinct drop point. Trace the packet in order before changing config.

## Hop-by-hop path

1. Application selects egress interface and multicast TTL / Hop Limit.
2. Host builds an IPv4/UDP packet with a **unicast source** and **multicast destination**.
3. Host maps the group algorithmically to an Ethernet multicast MAC; **ARP is not used**.
4. Access switch replicates per snooping state (or unknown-multicast flood policy).
5. First-hop / transit router accepts the packet only on the correct **RPF** interface toward `S`.
6. Router looks up `(S,G)` or applicable `(*,G)`, builds the effective OIL (excluding IIF), replicates.
7. Last-hop switch forwards to listener ports only.
8. Receiver NIC admits the frame; IP validates group/interface; UDP matches the port; app reads the datagram.

```mermaid
flowchart LR
    AppS["Source app"] --> HostS["Host L3/L2"]
    HostS --> SwS["Source switch"]
    SwS --> FHR["FHR / PIM"]
    FHR --> Core["Core RPF + OIL"]
    Core --> LHR["LHR"]
    LHR --> SwR["Receiver switch"]
    SwR --> HostR["Receiver NIC"]
    HostR --> AppR["Receiver app"]
```

Related: [IPv4 Ethernet mapping](../04_Addressing_and_Layer2_Mapping/03_IPv4_Ethernet_Mapping.md), [RPF check](../07_RPF_and_Forwarding/02_RPF_Check.md), [Forwarding and OIL](../07_RPF_and_Forwarding/07_Forwarding_Rules_and_OIL_Inheritance.md).

## Drop matrix

| Stage | Typical failure |
|---|---|
| App TTL too low | Stops at first router; L2 still floods |
| Wrong egress / VRF | Never reaches FHR in the intended table |
| MAC alias / NIC filter miss | Capture on wire OK, app silent |
| No snooping + no flood | Or flood storm without snooping |
| RPF fail | `show ip mroute` shows RPF neighbor; counters show fails |
| Null OIL / negative cache | Source seen, no receivers |
| Wrong UDP port / SO_REUSE | Kernel drops after IP accept |

## Configuration patterns

Minimal path enablement for a lab SSM channel:

### Cisco IOS / IOS XE

```text
ip multicast-routing
ip pim ssm range 232.0.0.0/8
!
interface GigabitEthernet0/0
 description toward source LAN
 ip address 192.0.2.1 255.255.255.0
 ip pim sparse-mode
!
interface GigabitEthernet0/1
 description toward receiver LAN
 ip address 198.51.100.1 255.255.255.0
 ip pim sparse-mode
 ip igmp version 3
```

### Junos

```text
set routing-options multicast ssm-groups 232.0.0.0/8
set protocols pim interface ge-0/0/0.0 mode sparse
set protocols pim interface ge-0/0/1.0 mode sparse
set protocols igmp interface ge-0/0/1.0 version 3
```

### FRRouting

```text
ip multicast-routing
ip pim ssm prefix-list SSM
!
ip prefix-list SSM permit 232.0.0.0/8
!
interface eth0
 ip pim
!
interface eth1
 ip pim
 ip igmp version 3
```

End-to-end recipes: [PIM-SSM config](../14_Configuration_and_Observation/03_PIM_SSM_Config_Pattern.md).

## Interactions

| Mechanism | Relationship |
|---|---|
| **TTL / scope** | Packet policy vs address scope—both must allow the path |
| **Assert** | Shared LAN may suppress one forwarder mid-path |
| **ECMP** | Selected RPF member must match arrival interface |
| **Host socket** | Binding, interface index, and SSM API must match the packet |

## Verification

Follow one sequence-marked packet:

1. Capture at source NIC — present, correct TTL, correct dest MAC.
2. Capture on first routed hop ingress — RPF accept counter increments.
3. Capture on LHR egress toward receiver VLAN.
4. Capture on receiver NIC — then confirm app read (not only tcpdump).

```text
show ip mroute 192.0.2.10 232.10.10.10
show ip rpf 192.0.2.10
show interfaces | include packets
tcpdump -ni any udp port 15000 and host 232.10.10.10
```

## Risks

- Stopping at “mroute looks fine” while MFIB or the access port is wrong.
- Using TTL as the only boundary (fails for large L2 domains).
- Blaming the network when the socket joined the wrong interface.

## Interview framing

“Trace eight stages from app TTL to receiver socket; each stage is a separate drop point, and RPF plus OIL only explain the routed middle of that path.”

---
