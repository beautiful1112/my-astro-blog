# One fabric, two paths

A practical blueprint for a 30-rack, 900-server securities data center: a general-purpose EVPN/VXLAN fabric, isolated ultra-low-latency trading paths, explicit service insertion, and failure domains that can be tested.

**Route everywhere. Extend Layer 2 selectively. Automate intent. Measure loss, not hope.**

| Axis | Value |
|---|---|
| **4** spines | ECMP core |
| **60** leaves | Pair per rack |
| **100G** uplinks | 25G server edge |
| **A/B** trading paths | Independent failure domains |

## General fabric with isolated trading lanes

Four spines connect to leaf pairs, plus border and service leaves. Separate A and B trading paths connect exchanges to feed handlers. Keep A and B independent from exchange handoff to application NIC.

```text
EVPN / VXLAN fabric
  Spine 1  Spine 2  Spine 3  Spine 4
      \       |       |       /
       Rack leaf pairs  (racks 01-30, 900 servers)
       Service leaf ---- FW / LB
       Border leaf ----- WAN / DCI

Trading A: Exchange A -> L1 / FPGA -> Feed A -+-> fabric
Trading B: Exchange B -> L1 / FPGA -> Feed B -+
```

## Three planes of the reference

| Lane | Job |
|---|---|
| A — General compute | Layer-3 Clos underlay, MP-BGP EVPN overlay, symmetric IRB, distributed anycast gateways, VRF tenancy |
| B — Trading paths | Physically independent A/B exchange paths; Layer-1 or deterministic low-latency switching where the latency budget demands it |
| C — Service insertion | Dedicated service leaves for firewalls, load balancers, WAN, Internet, and shared services |

The general fabric is not asked to be the fastest path to the exchange. The trading path is not asked to be the tenant overlay.

## Related

- [General compute fabric](02_General_Compute_Fabric.md)
- [Trading paths](03_Trading_Paths.md)
- [Service insertion](04_Service_Insertion.md)
- [Leaf-spine versus three-tier](../../04_CCDE/14_Data_Center_and_Cloud/01_Leaf_Spine_vs_Three_Tier.md)

---
