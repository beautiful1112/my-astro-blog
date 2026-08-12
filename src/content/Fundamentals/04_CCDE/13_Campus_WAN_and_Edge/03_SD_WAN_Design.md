# SD-WAN design

SD-WAN is **overlay policy + underlay diversity + a controller**. It is not “delete the underlay.”

## Design pieces

1. Underlay: at least two **independent** transports where RTO requires it
2. Overlay: segmentation (VPNs/VRFs), encryption, app-aware paths
3. Controller/vManage-class cluster: change plane HA and reachability from sites
4. Security: on-prem FW vs cloud-delivered vs both (constraint: inspection, sovereignty)
5. DIA: local Internet for SaaS vs hairpin to DC

If the controller cannot be reached, decide: **keep forwarding** on last known policy (usual) vs fail-closed.

Do not run a complex IGP over the overlay *and* a second one in the underlay without a reason. Often: underlay static/BGP to transports, overlay carries sites.

## Interview framing

“SD-WAN is overlay intent on diverse underlays. I design controller fate, DIA vs central inspect, and I never pretend one Internet circuit is HA.”

---
