# VXLAN EVPN data center

VXLAN is the **data plane**; EVPN is the **control plane**. Underlay is IGP or eBGP with MTU headroom and ECMP.

Multihoming: ESI / anycast GW. Do not recreate a giant L2 by stretching every VNI to every leaf “for mobility” without need.

ACI and other controllers wrap this into a fabric product—the planes are still there.

## Interview framing

“DC overlay is EVPN for state and VXLAN for packets on a dumb ECMP underlay. I keep VNIs as small as the app allows.”

---
