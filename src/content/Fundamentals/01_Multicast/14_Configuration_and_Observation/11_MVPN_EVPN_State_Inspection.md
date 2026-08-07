# MVPN and EVPN multicast state inspection

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Vendor commands vary, but the dependency chain is stable. Capture every layer for one exact tenant flow.

## Flow definition

```text
tenant/VRF/EVI:
source C-S:
group C-G:
receiver site/PE/port:
customer ASM or SSM:
expected ingress PE:
I-PMSI/S-PMSI or EVPN SMET transport:
VNI/labels/tunnel root and leaves:
```

## BGP MVPN inspection

Look for:

- VPN route to `C-S` or customer RP;
- Type 1/2 I-PMSI A-D route and imported Route Targets;
- Type 6 Shared Tree or Type 7 Source Tree Join route;
- Type 5 Source Active route when used;
- Type 3 S-PMSI binding for a selective flow;
- Type 4 Leaf A-D response when requested;
- PMSI Tunnel Attribute type, identifier, label, and leaf-required flag.

Then inspect the provider tunnel/LSP root, leaves, operational state, label programming, and packet counters. Finally inspect the receiver VRF `(C-S,C-G)` IIF/OIL.

## EVPN inspection

Look for:

- local IGMP/MLD `(*,G)` or `(S,G)` state per BD;
- Type 6 SMET route with EVI, Ethernet Tag, source/group, version, and include/exclude flags;
- Type 7/8 synchronization on a multihomed Ethernet segment;
- importing remote VTEPs and Route Targets;
- IMET/ingress-replication or selective tunnel association;
- VNI, outer source/destination, and underlay RPF;
- remote decapsulation and listener port replication.

## Counter locations

```text
customer ingress -> PE VRF lookup -> tunnel encapsulation -> provider transport
-> remote tunnel decap -> remote VRF/BD replication -> receiver egress
```

Compare packet deltas at each arrow. Labels and VNI select forwarding contexts; a packet can reach the remote PE yet disappear because decapsulation chooses no matching MVPN/BD.

## Safe debug practice

Prefer route/state displays, counters, streaming telemetry, and filtered captures. Control-plane trace/debug can be high-volume and CPU-expensive in a scaled MVPN/EVPN system. If enabled, constrain it to one VRF, neighbor, route type, source, or group and remove it immediately after collection.
