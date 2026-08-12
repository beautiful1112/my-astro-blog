# When the enterprise needs BGP

Bring BGP inside the enterprise when you need **policy, scale, or isolation** that an IGP should not provide.

## Good reasons

- Internet or WAN PE-CE
- DC leaf-spine (often eBGP)
- Multi-tenant VRFs / MPLS / EVMP
- Merging companies (seam)
- Traffic engineering between regions better expressed as policy than IGP metric hacks
- Prefix count beyond IGP comfort

## Bad reasons

- “BGP is more professional”
- Replacing 15 campus routers’ IGP with iBGP full mesh
- Redistributing the Internet table into OSPF/EIGRP

IGP still usually provides **underlay next-hop** for iBGP. Do not delete the IGP unless you have a full BGP-only design you can operate.

Deep dive: [BGP library](../../02_BGP/BGP_Deep_Dive.md).

## Interview framing

“Enterprise BGP is for policy and domain seams. The campus IGP can stay an IGP until prefix or policy pressure says otherwise.”

---
