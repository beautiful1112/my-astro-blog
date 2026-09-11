# Service insertion

Dedicated service leaves connect firewalls, load balancers, WAN, Internet, and shared services without turning every leaf into a policy device.

Make the service path explicit in both directions. Preserve VRF identity into the security stack and design for stateful symmetry.

```text
Tenant leaf (Trading VRF)
    -- L3VNI 50010 --> Service leaf pair (VRF handoff)
                           --> Firewall A/P (per-VRF context)
                               --> WAN / Internet
```

Policy boundary: VRF → subinterface / context → NAT zone → external routing.

## Why dedicated leaves

- Firewalls and load balancers are stateful; they need a designed path, not accidental ECMP through two appliances.
- Tenant leaves stay forwarding devices. Policy and NAT live at the service edge.
- Border (WAN/DCI) and service (FW/LB) can be separate pairs when failure domains or change windows differ.

## What this module does not do

Intra-subnet traffic cannot be inspected by a routed firewall unless the traffic is forced through it. East-west microsegmentation is a different design, not a side effect of north-south insertion.

Details: [explicit service path](../07_Security_Services/01_Explicit_Service_Path.md).

## Related

- [One fabric, two paths](01_One_Fabric_Two_Paths.md)
- [Routed firewall contexts](../07_Security_Services/02_Routed_Firewall_Contexts.md)
- [Transparent HA](../07_Security_Services/03_Transparent_HA.md)

---
