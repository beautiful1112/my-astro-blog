# QoS and congestion

Market-data multicast fails first at microburst boundaries. QoS must classify trusted feed traffic, admit peaks, and protect control plane (PIM/IGMP) without assuming lossless Ethernet fixes UDP semantics.

## Principles

- Classify and mark at trusted boundaries.
- Reserve for peak bursts, not averages.
- Strict priority protects market data but can starve other traffic; bound and police admission.
- Protect PIM/IGMP control traffic during data congestion.
- ASIC drops may occur in shared buffers before obvious egress counters.
- Pause/PFC can convert loss into latency and head-of-line blocking; lossless Ethernet is not automatically better for UDP feeds.

Related: [Capacity math](05_Capacity_Math.md), [Microburst debugging](../15_Troubleshooting/06_Microburst_Debugging.md).

## Class sketch

| Class | Traffic | Treatment |
|---|---|---|
| MD-INCREMENTAL | Live `(S,G)` feeds | Strict priority / EF, policed |
| MD-RECOVERY | Rewind/snapshot unicast | AF / controlled bandwidth |
| CONTROL | PIM, IGMP, BFD, PTP | Protected queue |
| DEFAULT | Bulk / best effort | WRED / leftover |

## Configuration patterns

### Cisco IOS / IOS XE — class-maps

```text
ip access-list extended ACL-MD-A
 permit udp host 192.0.2.10 host 232.10.10.10 eq 15000
ip access-list extended ACL-MD-B
 permit udp host 192.0.2.11 host 232.10.10.11 eq 15000
!
class-map match-any MD-LIVE
 match access-group name ACL-MD-A
 match access-group name ACL-MD-B
class-map match-any MD-CONTROL
 match access-group name ACL-PIM-IGMP
!
policy-map WAN-EDGE-OUT
 class MD-LIVE
  priority percent 30
  police cir 4000000000
 class MD-CONTROL
  bandwidth percent 5
 class class-default
  fair-queue
!
interface GigabitEthernet0/1
 service-policy output WAN-EDGE-OUT
```

### Junos (sketch)

```text
set firewall family inet filter MD-CLASS term LIVE from source-address 192.0.2.10/32
set firewall family inet filter MD-CLASS term LIVE from destination-address 232.10.10.10/32
set firewall family inet filter MD-CLASS term LIVE then forwarding-class md-live
set class-of-service schedulers md-live-sched priority strict-high
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **Multicast replication** | Egress QoS applies **per copy** |
| **LAG** | Per-member queues; one hot member drops first |
| **Host rings** | Network QoS cannot fix an undersized NIC ring |

## Verification

```text
show policy-map interface GigabitEthernet0/1
show interfaces GigabitEthernet0/1 counters errors
# Induce burst: MD class drops vs default; control plane Hellos still up
show ip pim neighbor
```

## Risks

- Strict priority without ingress policing (control-plane starvation).
- Marking inside the untrusted customer VRF.
- PFC enabled “for safety” on UDP market data.

## Interview framing

“Classify and police market data at trust boundaries, give it bounded priority, protect PIM/IGMP, and remember pause frames trade loss for latency—they do not create a reliable multicast pipe.”

---
