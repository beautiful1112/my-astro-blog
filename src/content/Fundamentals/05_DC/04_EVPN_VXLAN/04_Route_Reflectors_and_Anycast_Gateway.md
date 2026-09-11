# Route reflectors and anycast gateway

## Spines as EVPN route reflectors

Build overlay sessions between leaf loopbacks and spine route reflectors. The reflector should preserve the originating VTEP as the EVPN next hop. It does not need tenant VRFs or VNIs merely to reflect routes.

```text
Spine RR 1 ---- Leaf VTEP 1
Spine RR 2 ---- Leaf VTEP 1
Spine RR 1 ---- Leaf VTEP 2
Spine RR 2 ---- Leaf VTEP 2

Overlay BGP is between loopbacks. EVPN next hop stays the originating VTEP.
```

- Overlay BGP is between loopbacks, not the underlay link addresses.
- Next-hop-unchanged (or equivalent) so the EVPN next hop stays the originating VTEP.
- Spines may be underlay eBGP speakers and overlay iBGP RRs at once; those are two jobs.

## Distributed anycast gateway

Use the same gateway IP and virtual router MAC on every participating leaf. Hosts keep their default gateway when they move; EVPN updates their location.

Do not invent a “gateway VNI” as a routing protocol. The L3VNI is overlay transit for one tenant VRF. Type-5 supplies prefixes, VTEP next hops, and remote router MAC.

## Related

- [Symmetric IRB](03_Symmetric_IRB.md)
- [One eBGP unit per rack](../03_Underlay/02_eBGP_Per_Rack.md)
- [Route-reflector roles](../../02_BGP/13_Route_Reflection_and_Confederations/01_Route_Reflector_Roles.md)
- [EVPN MAC mobility](../../02_BGP/19_EVPN/05_MAC_Mobility.md)

---
