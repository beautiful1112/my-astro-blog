# Underlay contract

The underlay exists to make every VTEP loopback reachable with multiple equal-cost paths. It should not carry tenant intent.

| Contract | Meaning |
|---|---|
| IPv4/IPv6 loopbacks reachable | Every VTEP can encapsulate to every other VTEP |
| Fast failure detection | BFD and fast-external-fallover so ECMP members drop quickly |
| No tenant prefixes | Overlay L2VPN EVPN carries tenant reachability |

Keep the overlay separate: underlay IPv4 unicast reaches VTEPs; overlay L2VPN EVPN carries tenant reachability.

## What the underlay advertises

Advertise loopback `/32` (or IPv6 `/128`) only. Accept infrastructure pools only. Do not redistribute connected server subnets into the underlay.

## Why this is the first design decision

If tenant prefixes leak into the underlay, spines become accidental tenant routers, ECMP and RPF stories blur, and “the fabric is down” becomes indistinguishable from “one VRF is wrong.”

## Related

- [One eBGP unit per rack](02_eBGP_Per_Rack.md)
- [Leaf intent and guardrails](04_Leaf_Intent_and_Guardrails.md)
- [Plane separation](../04_EVPN_VXLAN/01_Plane_Separation.md)

---
