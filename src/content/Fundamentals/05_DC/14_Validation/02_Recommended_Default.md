# Recommended default

Final design position for this 30-rack, 900-server securities fabric.

| Domain | Default |
|---|---|
| **General fabric** | eBGP underlay + iBGP EVPN overlay, symmetric IRB, distributed anycast gateways |
| **Trading** | Independent A/B physical paths, SSM market data, PTP, explicit capture points, measured tail latency |
| **Services** | Dedicated service and border leaves, VRF-aware firewall contexts, L3-first DCI |
| **Operations** | Source-of-truth automation, invariant checks, scoped rollback, failure-oriented acceptance tests |

Architecture is the set of failures you choose — and the evidence that proves they stay contained.

## Related

- [How to use this guide](../01_Study_Roadmap/01_How_to_Use_This_Guide.md)
- [One fabric, two paths](../02_Reference_Architecture/01_One_Fabric_Two_Paths.md)
- [Scripted failures](01_Scripted_Failures.md)

---
