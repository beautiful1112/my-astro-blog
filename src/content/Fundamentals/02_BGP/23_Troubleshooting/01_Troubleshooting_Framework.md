# BGP Troubleshooting Framework

Write the problem as one testable statement:

“On router R, in VRF V and AFI/SAFI F, prefix P from peer N is/is not received, accepted, best, installed, advertised, or forwarding.”

Then walk one direction:

**transport → session → capability → received → policy → eligible → best → RIB/FIB → export → remote selection → forwarding**

Collect timestamps and compare both ends. Avoid changing policy until the failing stage is proven.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
