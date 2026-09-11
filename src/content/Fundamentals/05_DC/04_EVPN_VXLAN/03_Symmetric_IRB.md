# Symmetric IRB

Route at ingress, route at egress. Path: L2VNI → L3VNI → L2VNI.

A packet moves from a source host through the source Layer-2 VNI, tenant Layer-3 VNI, and destination Layer-2 VNI to a destination host. First lookup: tenant VRF. Second lookup: local subnet.

```text
Host A 10.10.110.10
    -> Leaf 1 anycast GW  (L2VNI 10110)
        -- L3VNI 50010 --> Leaf 2 anycast GW  (L2VNI 10120)
            -> Host B 10.10.120.20

First lookup: tenant VRF. Second lookup: local subnet.
```

## Why symmetric

Both ingress and egress leaves perform routing in the tenant VRF. The inner VXLAN header uses the L3VNI in the routed middle, so every leaf can use the same forwarding pattern. Asymmetric IRB routes only at ingress and bridges at egress; it is common in static or centralized designs, not the default here.

## Distributed anycast gateway

Use the same gateway IP and virtual router MAC on every participating leaf. Hosts keep their default gateway when they move; EVPN updates their location.

## Related

- [EVPN route types](02_Route_Types.md)
- [Route reflectors and anycast gateway](04_Route_Reflectors_and_Anycast_Gateway.md)
- [Object hierarchy](../06_VRFs_and_Gateways/01_Object_Hierarchy.md)

---
