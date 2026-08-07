# EVPN tenant multicast control plane

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

EVPN IGMP/MLD proxy replaces broad flooding of membership packets with BGP-distributed state. Each PE acts as the membership router/proxy for locally attached hosts and translates the relevant state into EVPN routes.

## Local membership to BGP

1. host sends IGMP/MLD Report on an attachment circuit;
2. PE creates local `(*,G)` or `(S,G)` listener state for the bridge domain;
3. compatible reports from several hosts are aggregated;
4. PE originates a Type 6 SMET route containing Ethernet Tag, source/group fields, version, and include/exclude semantics;
5. remote PEs import the route for the EVI/BD;
6. their overlay replication state includes only the advertising PE/VTEP where supported.

BGP is stateful, so a new route/withdraw replaces periodic flooding of every host report across the overlay. Local periodic Queries and host timers still exist at the edge.

These are EVPN route types. They must not be confused with MCAST-VPN Type 6 Shared Tree Join or Type 7 Source Tree Join routes, which belong to a different BGP NLRI family.

## Query proxy

An EVPN PE can proxy membership Queries so tenant hosts see normal querier behavior without every Query being flooded end to end. Querier identity, version compatibility, Maximum Response Time, and source address must remain consistent across the virtual subnet.

If two sites believe different queriers or membership versions are authoritative, their aggregated BGP state can outlive local host state or expire too soon.

## Multihomed Ethernet segment

All-active EVPN multihoming can attach one receiver segment to two PEs. Type 7 Membership Report Synch and Type 8 Leave Synch routes coordinate membership between those PEs:

- either PE can learn the local Report;
- the DF advertises/maintains the effective SMET state;
- a leave starts a response interval rather than immediately deleting shared-segment interest;
- a report seen by either PE during that interval preserves state;
- DF change should not force hosts to wait for a complete membership refresh.

The behavior is conceptually similar to safe last-member processing, but synchronization occurs through BGP for an EVPN Ethernet segment.

## Include/exclude source state

IGMPv3/MLDv2 can express source filters. The SMET encoding can represent `(*,G)` and `(S,G)` semantics plus include/exclude information. Scale planning must therefore count source-specific membership, not only groups or VNIs.

A platform that imports group state but cannot program source-specific overlay replication may over-deliver unwanted sources to a VTEP while the final LHR/host filters them. Document the actual hardware granularity.

## Data-plane binding

SMET says **where interest exists**. Another mechanism supplies transport:

- ingress replication sends unicast VXLAN copies only to interested VTEPs;
- underlay multicast maps the flow to a shared/selective underlay group;
- an S-PMSI/selective tunnel binds the tenant flow to an optimized tree.

Do not interpret a Type 6 route as the data tunnel itself.

## Failure matrix

| Failure | Expected evidence |
|---|---|
| local Report not converted | local snooping state exists, no Type 6 advertisement |
| RT/policy error | Type 6 advertised but absent on remote PE |
| BGP route present, no delivery | tunnel/replication or hardware binding missing |
| DF change loses flow | Type 7/8 synchronization or DF programming failure |
| one source leaks | include/exclude/source-specific state collapsed to group-only |
| leave causes long over-delivery | route withdrawal/last-listener timer not completing |
| duplicate tenant packets | both multihoming PEs or both old/new tunnels forwarding |

Capture the local membership packet, BGP update/withdraw timeline, remote tunnel-list change, and data sequence. Each is a separate proof point.
