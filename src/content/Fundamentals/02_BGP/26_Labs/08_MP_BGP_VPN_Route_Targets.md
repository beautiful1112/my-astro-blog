# Lab: MP-BGP VPN Route Targets

## Topology

Two PEs share an MPLS/SR underlay and each hosts two VRFs.

## Objectives

- Advertise VPNv4/v6 routes.
- Distinguish RD from RT.
- Build full-mesh and hub-spoke import policy.

## Tasks

1. Use unique RDs and one shared RT for a test VPN.
2. Verify VPN NLRI, next hop, label, and RT.
3. Remove the receiving VRF's import RT: route remains in VPN BGP but leaves the VRF.
4. Add a shared-services RT selectively.
5. Trace transport and VPN labels for a data packet.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
