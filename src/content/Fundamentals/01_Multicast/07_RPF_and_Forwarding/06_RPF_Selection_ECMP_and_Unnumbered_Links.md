# RPF selection, ECMP, and neighbor resolution

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

An RPF check is more than “a route to the source exists.” The multicast control plane must select an upstream interface and, for PIM joins, an upstream neighbor for the tree root.

## Selection inputs

Depending on the platform, the MRIB selection can consider:

- multicast-specific routes before or instead of unicast routes;
- route administrative preference/distance;
- longest prefix match;
- route metric;
- recursive next-hop resolution;
- ECMP hashing or a deterministic tie-break;
- PIM neighbor presence on the resolved interface; and
- static multicast routes or RPF overrides.

Inspect the multicast RPF result directly. `show route S` and a successful unicast ping do not prove which path PIM uses.

## ECMP

If several equal-cost next hops reach `S` or the RP, an implementation may select one upstream per `(S,G)`, per source, or using another stable hash. Data must arrive on the selected RPF interface/neighbor. A different equal-cost path is not automatically accepted merely because it has the same metric.

After a next-hop failure, the hash can move:

1. MRIB selects a surviving upstream;
2. PIM sends Join toward the new neighbor;
3. data begins on the new IIF;
4. old state is pruned/expires;
5. MFIB updates.

During the interval, packets on the old or alternate ECMP member may fail RPF or arrive twice. Measure this for loss-sensitive flows.

## Parallel links and LAGs

A routed port-channel usually presents one logical RPF interface even though member selection happens below it. A failure inside the LAG may change physical arrival without changing PIM state. Conversely, separate routed links are distinct RPF interfaces and need explicit ECMP behavior.

Do not use aggregate LAG bandwidth as proof that one multicast flow can use all members; platform hashing or multicast replication may pin it to one.

## Unnumbered and multiaccess links

PIM must map a recursive/unnumbered route to a real adjacent neighbor. Secondary-address Hello options help associate addresses with the correct neighbor. On multiaccess links, Assert state can override the otherwise selected upstream neighbor for a flow.

Common failure signatures include route present but “no RPF neighbor,” Join sent to the wrong neighbor address, or traffic accepted only after adding an unnecessary static mroute. Fix adjacency/address association and route resolution before masking it with overrides.

## Static multicast routes

A static mroute/RPF override can intentionally make multicast topology differ from unicast. Use one only with documented ownership, failover behavior, recursive reachability, and monitoring. A stale override can survive an IGP repair and create a hidden black hole.

## Verification

For both `S` and `RP(G)` record:

```text
VRF/address family
selected route prefix and protocol
RPF interface
RPF neighbor
preference and metric
ECMP candidates and selected member
PIM adjacency on selected interface
accepted and failed RPF counters
```

Repeat after every relevant route change; RPF is dynamic state, not a one-time property of the topology diagram.
