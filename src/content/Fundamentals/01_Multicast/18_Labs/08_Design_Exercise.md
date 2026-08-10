# Lab 8: Design exercise

Design multicast market-data delivery with explicit independence and evidence.

## Topology (constraints)

```text
2 exchange cross-connects (A/B)
2 network fabrics
40 receiver servers in two rooms
300 groups
5 Mpps aggregate peak
Single link, switch, or NIC failure must not interrupt normalized book
```

Documentation addresses for sketches: sources `192.0.2.10/11`, groups `232.10.10.0/24`, receivers `198.51.100.0/24` and `198.51.101.0/24`.

## Objectives

Produce a design packet covering L2/L3, SSM/ASM, security, QoS, capacity, recovery, and proof of independence.

## Config touchpoints (expected artifacts)

- `(S,G,port)` allocation table
- Querier and PIM placement
- Boundary ACLs ([template](../14_Configuration_and_Observation/16_Multicast_Boundary_and_ACL_Config.md))
- QoS class-maps for live vs recovery
- Host NIC / ring / stale-timer standards

## Tasks

Specify:

1. Group/source allocation and SSM vs ASM.
2. L2 domains, snooping, dual queriers.
3. L3 boundaries and RPF topology per fabric.
4. A/B arbitration and recovery placement.
5. QoS and peak pps capacity math.
6. Time sync (PTP) domains.
7. Security three-level boundaries.
8. Evidence plan proving A/B independence under failure.

## Failure injection (design review drills)

Walk through: leaf failure, fabric spine failure, NIC failure, querier loss, RP loss (if ASM), correlated metro cut. For each, state book impact and detection metric.

## Expected evidence

```text
Diagram with no shared fate for A/B through last justified point
Capacity sheet: pps, replication, LAG pin assumptions
Failure table: event -> metric -> customer impact -> RTO
ACL excerpts for source/tree/receiver admission
```

## Cross-links

[Low-latency design pattern](../12_Quant_Trading_Market_Data/08_Low_Latency_Design_Pattern.md), [A/B fail together](../16_Practical_Cases/07_AB_Feeds_Fail_Together.md), [Boundary principle](../13_Security/03_Boundary_Principle.md), [Capacity math](../12_Quant_Trading_Market_Data/05_Capacity_Math.md).

---
