# EVPN over VXLAN vs MPLS

EVPN is the control plane; VXLAN and MPLS are possible data planes.

| Property | VXLAN | MPLS |
|---|---|---|
| Service identifier | VNI | MPLS service label |
| Underlay | IP routed fabric | Label-switched transport |
| Common environment | Data center | Service provider/WAN |
| Encapsulation endpoint | VTEP | PE |

The EVPN route's encapsulation signaling and service identifier must agree with the data plane.

When routes look correct but traffic fails, verify underlay reachability, tunnel/label state, MTU, service mapping, and hardware programming.

---

