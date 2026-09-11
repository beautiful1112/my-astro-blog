# How to use this guide

This library is the blog edition of the **DC Fabric Field Guide**: a practical blueprint for a 30-rack, 900-server securities data center. The original single-page notebook is split here into modules so it sits next to Multicast, BGP, EIGRP, and CCDE.

The design has one general-purpose fabric and two trading paths:

- a general-purpose EVPN/VXLAN fabric for scale;
- isolated ultra-low-latency trading paths for certainty;
- explicit service insertion;
- failure domains that can be tested.

## Scale of the reference

| Axis | Value |
|---|---|
| Racks | 30 |
| Servers | 900 |
| Spines | 4 — ECMP core |
| Leaves | 60 — pair per rack |
| Uplinks | 100G |
| Server edge | 25G |
| Trading | Independent A/B failure domains |

## Design slogans

- Route everywhere.
- Extend Layer 2 selectively.
- Automate intent.
- Measure loss, not hope.

## How to read the modules

Read in this order the first time:

1. [Reference architecture](../02_Reference_Architecture/README.md) — one fabric, two paths, service leaves.
2. [Underlay](../03_Underlay/README.md) then [EVPN/VXLAN](../04_EVPN_VXLAN/README.md) — reachability versus tenant state.
3. [Static VXLAN](../05_Static_VXLAN/README.md) — what EVPN actually replaces.
4. [VRFs and gateways](../06_VRFs_and_Gateways/README.md) then [security services](../07_Security_Services/README.md).
5. [Market data](../08_Market_Data/README.md), [low latency and PTP](../10_Low_Latency_and_PTP/README.md).
6. [Multi-site](../09_Multi_Site_and_DCI/README.md), [Kubernetes](../11_Kubernetes/README.md), [automation](../12_Automation/README.md).
7. [Troubleshooting](../13_Troubleshooting/README.md) and [validation](../14_Validation/README.md) — a design is complete when its failures are scripted.

Protocol mechanics already live in [BGP EVPN](../../02_BGP/19_EVPN/README.md), [multicast market data](../../01_Multicast/12_Quant_Trading_Market_Data/README.md), and [CCDE data center](../../04_CCDE/14_Data_Center_and_Cloud/README.md). This library is the **when and how they compose** in one trading-ready fabric.

## Related

- [Learning objectives](02_Learning_Objectives.md)
- [One fabric, two paths](../02_Reference_Architecture/01_One_Fabric_Two_Paths.md)
- [Recommended default](../14_Validation/02_Recommended_Default.md)

---
