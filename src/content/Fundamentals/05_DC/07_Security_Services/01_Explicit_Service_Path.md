# Explicit service path

Connect firewalls and load balancers to dedicated service leaves. Preserve VRF identity into the security stack and design for stateful symmetry.

## Per-VRF north–south path

Tenant leaves send traffic through an L3VNI to a service leaf pair, then to per-VRF firewall contexts and border routers.

```text
Tenant leaf (Trading VRF)
    -- L3VNI 50010 --> Service leaf (VRF handoff)
                           --> Firewall A/P
                               --> WAN / Internet
```

Policy boundary: VRF → subinterface / context → NAT zone → external routing.

Return traffic must follow the same stateful appliance. Symmetric insertion is a path-design problem, not a NAT checkbox.

## Related

- [Service insertion](../02_Reference_Architecture/04_Service_Insertion.md)
- [Routed firewall contexts](02_Routed_Firewall_Contexts.md)
- [Default route, leaking, and routed Clos](../06_VRFs_and_Gateways/03_Default_Route_Leaking_and_Routed_Clos.md)

---
