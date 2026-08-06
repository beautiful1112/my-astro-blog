# Multicast forwarding rules and OIL inheritance

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

For each multicast packet, a router conceptually performs two decisions:

1. **acceptance:** did `(S,G)` arrive on an eligible RPF interface?
2. **replication:** which outgoing interfaces are interested and permitted?

A destination group lookup alone is insufficient because the same `G` can have different sources, incoming paths, prunes, and outgoing branches.

## Conceptual lookup

1. Identify `(S,G)` from the IP header and VRF.
2. Find source-specific forwarding state if present.
3. Otherwise use applicable `(*,G)` shared-tree state for ASM.
4. Determine whether the packet is arriving as source-tree or RP-tree traffic.
5. Check the expected IIF/RPF neighbor.
6. Build the effective OIL.
7. Remove the IIF and any pruned, Assert-loser, scoped, filtered, or down interfaces.
8. Replicate once to every remaining OIF and apply per-interface TTL/Hop Limit processing.

Implementations optimize this into MFIB entries; the logical rules remain useful for diagnosis.

## Effective OIL

For an ASM `(S,G)`, downstream interest can be inherited from `(*,G)`. Conceptually:

```text
effective OIL =
    explicit (S,G) joined interfaces
  + eligible interfaces inherited from (*,G)
  - (S,G,rpt) pruned interfaces
  - Assert-loser interfaces
  - IIF
  - policy/boundary/down interfaces
```

This explains why an `(S,G)` entry can forward onto an interface that did not send an explicit source Join, and why `(S,G,rpt)` is needed after only one source switches away from the RPT.

## Same-interface forwarding

Ordinary routed forwarding does not send a copy back out the packet's IIF. On shared source/receiver LANs, local-host delivery and PIM Assert/DR behavior complicate what appears in control output, but the router must not form a replication loop. If a CLI lists an interface as both IIF and inherited OIF, inspect the effective MFIB and flags rather than assuming a duplicate is transmitted.

## Negative cache and null OIL

Platforms may create `(S,G)` state with no OIF when traffic arrives without receivers. This negative/cache state can suppress repeated control punts or record Register/source activity. It proves source observation, not receiver interest.

Likewise, a non-null control OIL does not guarantee packets leave the box if the MFIB is unprogrammed, TTL expires, an ACL drops, replication resources are exhausted, or the interface queue discards them.

## Packet counters

Counters can live at different layers:

- control-plane mroute cache;
- hardware `(S,G)`/replication entry;
- physical ingress/egress interface;
- queue/drop reason;
- tunnel encapsulation; and
- receiver NIC/application.

Counter absence on one CLI is not proof of no traffic. Use synchronized deltas and follow a sequence-marked packet across boundaries.
