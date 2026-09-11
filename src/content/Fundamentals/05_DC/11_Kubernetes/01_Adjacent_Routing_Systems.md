# Adjacent routing systems

The physical Clos carries node reachability. The CNI decides pod reachability, policy, and encapsulation. Avoid accidental double overlays.

| Identity | Behavior | Design implication |
|---|---|---|
| Node IP | Stable infrastructure address | Advertise or route through the underlay |
| Pod IP | Usually changes when a pod is recreated elsewhere | Do not design VM-style IP mobility around ordinary pods |
| Service / DNS | Stable application identity over changing endpoints | Use this for consumers, not individual pod persistence |
| KubeVirt VM | May have genuine mobility requirements | Evaluate L2 extension or routed mobility separately |

Consumers should follow Service / DNS, not a pod address that moved with a YAML apply.

## Related

- [CNI and MTU](02_CNI_and_MTU.md)
- [Object hierarchy](../06_VRFs_and_Gateways/01_Object_Hierarchy.md)

---
