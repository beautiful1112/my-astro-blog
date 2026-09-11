# Overlapping addresses

Trading and production can reuse an address safely while they stay isolated. The same prefix is ambiguous if both leak into one shared VRF.

```text
Trading VRF     L3VNI 50010
  L2VNI 10110   10.10.10.50  MAC-A  Feed handler
  L2VNI 10120   10.10.20.0/24       Trading applications

Production VRF  L3VNI 50020
  L2VNI 20110   10.10.10.50  MAC-B  Application host
  L2VNI 20120   10.20.20.0/24       Platform services
```

`10.10.10.50` behind two MACs is legal **across VRFs**. It is a duplicate-IP incident **inside one VRF**. See [duplicate IP](../13_Troubleshooting/02_Duplicate_IP.md).

Overlapping addresses that must communicate require NAT, a VRF-aware proxy, split DNS, or separate firewall contexts.

## Related

- [Object hierarchy](01_Object_Hierarchy.md)
- [Default route, leaking, and routed Clos](03_Default_Route_Leaking_and_Routed_Clos.md)
- [Duplicate IP](../13_Troubleshooting/02_Duplicate_IP.md)

---
