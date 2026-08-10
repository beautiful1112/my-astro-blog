# Layer-2 design for market data

Loss-sensitive market-data plants treat the access VLAN as part of the **latency and loss budget**, not as a convenience broadcast domain. The L2 design must make queriers, fan-out, and failure domains explicit.

## Design rules

- Keep loss-sensitive multicast VLANs **small and intentional**.
- Provide **redundant queriers** in L2-only feed networks.
- Verify `(VLAN,G)` and, where supported, `(VLAN,S,G)` **scale** before go-live.
- Validate replication fan-out, egress bandwidth, and simultaneous high-rate channels.
- Check **MLAG** peer-link and failover programming for duplicate/loss windows.
- Treat SPAN as potentially lossy; use a **TAP** or reliable capture path when exact loss evidence matters.
- Separate A/B feeds across different switch planes, uplinks, and NIC queues when arbitration requires independence.

Related: [AB line arbitration](../12_Quant_Trading_Market_Data/03_AB_Line_Arbitration.md), [L2 redundancy](10_L2_Redundancy_MLAG_Stack_and_Topology_Changes.md), [Capacity math](../12_Quant_Trading_Market_Data/05_Capacity_Math.md), [L2 snooping config](../14_Configuration_and_Observation/08_L2_Snooping_Configuration_Patterns.md).

## Reference layout

```text
Feed A leaf ---+
               +-- MLAG / dual ToR -- receivers (dual NIC)
Feed B leaf ---+
Querier-1 (primary) and Querier-2 (backup) on the VLAN
mrouter ports toward LHRs only where routed distribution exists
```

## Configuration patterns

### Cisco-like leaf

```text
ip igmp snooping
ip igmp snooping vlan 120
ip igmp snooping vlan 120 mrouter interface Port-channel1
! redundant querier addresses on two distribution switches
ip igmp snooping querier
ip igmp snooping querier address 192.0.2.2
!
! no global immediate leave
! storm control: set above known feed peaks, alert on assert
```

### Junos

```text
set protocols igmp-snooping vlan MD-A
set protocols igmp-snooping vlan MD-A interface ae1.0 multicast-router-interface
set protocols igmp-snooping vlan MD-B
```

### Receiver host

```text
# Pin A and B feeds to different NICs/queues; join both (S,G)
# Verify with: ip maddr show ; ethtool -g eth0
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **SSM** | Prefer `(S,G)` snooping where platform supports it |
| **QoS / buffers** | Microbursts kill both A and B on shared queues |
| **PTP / capture** | Timestamp accuracy needs non-SPAN paths |
| **Routed distribution** | L2 edge + PIM core; don’t stretch feed VLANs campus-wide |

## Verification

1. Scale test: N channels × M receivers; watch TCAM / MDB.
2. Fail primary querier; membership must not age out.
3. MLAG peer isolation: measure duplicate frames and loss.
4. Burst test: confirm A/B independence under egress congestion.
5. Compare TAP sequence vs host sequence during peaks.

```text
show ip igmp snooping groups summary
show ip igmp snooping mrouter
show interfaces counters storm-control
```

## Risks

- One giant “MD VLAN” across the firm.
- A and B on the same leaf ASIC and same NIC queue.
- SPAN-based loss proofs used in disputes with venues.

## Interview framing

“Market-data L2 design keeps VLANs small, queriers redundant, scale proven, A/B failure domains separate, and uses TAPs—not SPAN—when loss evidence must be trusted.”

---
