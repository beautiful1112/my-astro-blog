# Wide metrics

**Wide metrics** extend EIGRP beyond the classic 32-bit composite scaling limits that struggled with modern high-bandwidth interfaces (multiple paths looking “equal” after integer saturation). Wide metrics use a **64-bit** style metric space with **throughput** and **latency** style components (evolved bandwidth/delay thinking) and typically feed the RIB through a configurable **rib-scale** so route metrics still fit platform RIB expectations.

## Why classic saturates

```text
BW_term = 10^7 / BW_kbps
```

As BW grows huge, BW_term shrinks toward indistinguishable integers after scaling—parallel 10G/40G/100G paths may not differentiate cleanly. Wide metrics address that dynamic range.

Related: [Composite metric formula](01_Composite_Metric_Formula.md), [Reading show EIGRP topology](../06_Topology_Table_and_RIB/06_Reading_Show_EIGRP_Topology.md).

## Operational differences

| Topic | Classic | Wide |
|---|---|---|
| Metric width | 32-bit composite world | 64-bit capable |
| Interface story | bandwidth + delay | throughput / latency oriented |
| Topology display | Smaller integers | Very large numbers |
| RIB | Composite often used directly | Scaled for RIB install |
| Neighbor mix | Must be consistent in practice | Mixing classic/wide peers is a migration hazard |

## Configuration patterns (Cisco named mode)

Exact syntax varies by IOS XE train; named mode is the home for wide metrics:

```text
router eigrp CAMPUS
 address-family ipv4 unicast autonomous-system 100
  metric rib-scale 128
  ! wide-metric / throughput-latency features per release
 exit-address-family
```

Consult the image’s Command Reference for `metric rib-scale` and wide-metric enablement. Lab both ends before production cutover.

## Verification

```text
show eigrp address-family ipv4 topology
show ip protocols
show ip route eigrp
```

Confirm both peers show compatible metric mode and that successor selection still matches design intent after enablement.

## Risks

- Enabling wide metrics on one side only → adjacency or metric interpretation issues.
- Comparing classic lab numbers to wide production output in interviews without saying which mode.
- RIB-scale mis-set → confusing `show ip route` metrics vs topology.

## Interview framing

“Wide metrics give EIGRP a 64-bit metric space so high-speed interfaces stay differentiable, with RIB scaling for install—classic 32-bit composites are what most textbooks still calculate by hand.”

---
