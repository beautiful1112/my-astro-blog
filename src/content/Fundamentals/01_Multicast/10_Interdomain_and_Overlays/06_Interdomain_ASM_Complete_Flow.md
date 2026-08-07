# Interdomain ASM complete control-plane flow

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Traditional interdomain IPv4 ASM combines three independent mechanisms:

| Problem | Mechanism | State carried |
|---|---|---|
| reach source/RP through multicast topology | MBGP or other MRIB routes | source/RP IP prefixes and next hops |
| discover an active source in another PIM domain | MSDP | Source-Active `(S,G,originating-RP)` knowledge |
| build the packet tree | PIM-SM | `(*,G)`, `(S,G)`, and prune state |

No single mechanism replaces the other two.

## Topology

```text
S -- FHR/RP-A -- AS 65010 edge ==== AS 65020 edge -- RP-B/LHR -- R
       |              MBGP + PIM interconnect            |
       +================ MSDP SA =========================+
```

`S` is in AS 65010. Receiver `R` requests ASM group `G` in AS 65020. Each domain has its own RP.

## Source-side sequence

1. `S` sends to `G`.
2. its FHR registers to RP-A;
3. RP-A learns `(S,G)` and originates an MSDP SA;
4. outbound SA policy permits the source and group;
5. SA traverses the accepted MSDP peer-RPF path to RP-B.

The SA informs RP-B that the source exists; it does not establish a data tunnel between RPs.

## Receiver-side sequence

1. `R` reports interest in `G`;
2. LHR sends `(*,G)` Join toward RP-B;
3. RP-B finds local interest and an accepted SA for `(S,G)`;
4. RP-B performs RPF toward `S` using its MRIB, commonly populated by multicast SAFI routes;
5. RP-B sends `(S,G)` Join toward AS 65010;
6. each border/transit router follows its multicast RPF path and has PIM adjacency/policy for the flow;
7. the Join reaches the source tree;
8. native data returns across the interdomain tree to RP-B and its receivers;
9. LHR may switch to an SPT directly toward `S`.

## Policy boundaries

At every domain edge define separately:

- multicast source/RP prefixes allowed in MBGP SAFI 2;
- PIM neighbors and Join/Prune source/group policy;
- data-plane source/group boundaries and TTL scope;
- MSDP peers, peer-RPF model, and inbound/outbound SA filters;
- maximum SAFI prefixes, SA entries, mroute state, and data rate;
- RP and BSR/Auto-RP scope—internal RP discovery should not leak unintentionally.

An allowed SA with denied PIM Join produces source knowledge but no tree. An allowed PIM Join with no source route produces no RPF neighbor. A correct tree with a data ACL still produces no packets.

## Failure examples

| State observed | Likely missing plane |
|---|---|
| MSDP session established, no SA | source registration, SA export, peer-RPF, or filter |
| SA cached at RP-B, no `(S,G)` Join | no local `(*,G)` interest or policy rejects source |
| `(S,G)` Join desired, no RPF neighbor | MBGP/MRIB route or PIM adjacency missing |
| Join crosses AS boundary, no data | source tree, data RPF, boundary ACL, TTL, or upstream OIL |
| established source works, new source fails | MSDP/registration plane hidden by existing state |
| ping to source succeeds, RPF fails | unicast SAFI healthy while multicast SAFI/path is wrong |

## SSM simplification

For interdomain SSM, the receiver already knows `S`. The required functions reduce to source-prefix reachability in the MRIB, PIM `(S,G)` Join signaling, and data forwarding/policy. There is no RP, Register, shared tree, or MSDP source discovery. This is why SSM is strongly preferred for controlled cross-domain feeds.
