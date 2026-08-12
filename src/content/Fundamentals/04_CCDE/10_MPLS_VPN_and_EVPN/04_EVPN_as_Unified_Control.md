# EVPN as unified control

EVPN (MP-BGP) is a **control plane** for MAC/IP, used with VXLAN in DC and with MPLS/PBB in WAN. It replaces flood-and-learn as the primary teacher of reachability.

Design still splits:

- **Management:** controllers/assurance optional
- **Control:** BGP EVPN, RTs, ESI/multihoming
- **Data:** VXLAN, MPLS, or PBB
- **Policy/security:** which VRFs/VNIs, DCI or not

Multi-site EVPN without a DCI requirement is how you stretch fate. Default: **L3 between sites**, EVPN inside a site.

See also [VXLAN EVPN DC](../14_Data_Center_and_Cloud/02_VXLAN_EVPN_DC.md).

## Interview framing

“EVPN is BGP for L2/L3 overlay state. I still refuse to stretch L2 between DCs unless the requirement is explicit.”

---
