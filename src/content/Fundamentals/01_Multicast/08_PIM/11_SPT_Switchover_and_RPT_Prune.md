# SPT switchover and RPT prune

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

PIM-SM can move an ASM receiver branch from the RP tree to a source-rooted shortest-path tree. The goal is to improve path, latency, and RP/core load without delivering duplicate copies.

## Trigger policy

The last-hop router can switch:

- immediately after learning a source;
- after traffic exceeds a configured rate threshold; or
- never, remaining on the RPT.

These are implementation policies, not different PIM modes. Immediate switching creates per-source state quickly; an infinite threshold conserves `(S,G)` state but keeps path stretch and RP-tree dependency for data.

## Make-before-break sequence

1. The LHR receives `(S,G)` data on the RPT through its `(*,G)` IIF.
2. Policy triggers an `(S,G)` Join toward `S` using source RPF.
3. The RPT remains forwarding while the source tree is constructed.
4. A packet arrives on the source-facing IIF. The router determines that the SPT is valid and sets the SPT bit.
5. The router prefers the SPT copy for downstream forwarding.
6. It sends `(S,G,rpt)` Prune state toward the RP so source `S` no longer follows this branch of the shared tree.

Joining before pruning avoids a deliberate outage. The overlap can briefly produce packets on both incoming interfaces; correct SPT-bit and RPF logic prevent duplicate downstream delivery.

## Why the SPT bit matters

The existence of `(S,G)` control state alone is insufficient. The router must decide when incoming source-tree data is acceptable and when RPT traffic for that source should no longer be used. The SPT bit represents that forwarding transition.

Vendor output may show `SPT`, `spt-bit`, `T`, `RPT`, or an equivalent flag. Confirm with IIF and counters rather than relying on a letter without decoding the platform legend.

## `(S,G,rpt)` prune semantics

`(*,G)` means the branch wants all sources. After switching only `S`, the router still wants other sources through the RPT. It therefore cannot prune all of `G`. `(S,G,rpt)` is negative per-source state that says: inherit the shared tree for `G`, except do not send the RPT copy of `S` down this branch.

Intermediate routers aggregate this state. Where every downstream branch prunes `S` from the RPT, the prune can progress toward the RP. Where some branch remains RPT-based, the RPT copy continues for that branch.

## Switching back or rebuilding

If the SPT path fails, the router may:

- follow a newly converged MRIB path to `S` and refresh the `(S,G)` Join;
- temporarily accept RPT traffic again if shared-tree state remains usable; or
- experience loss until Join and RPF state converge.

Behavior and timers vary. Test actual failover because an established `(S,G,rpt)` prune, stale SPT bit, or slow MRIB convergence can delay fallback.

## Operational validation

Before switch:

- data arrives on the RPF interface toward RP;
- `(*,G)` has the receiver OIF;
- `(S,G)` may be absent or SPT bit clear.

During switch:

- `(S,G)` Join travels toward source;
- both paths may carry the flow briefly;
- duplicates should not increase at the receiver.

After switch:

- `(S,G)` IIF points toward source and counters rise;
- SPT bit is set;
- receiver OIF is in the effective `(S,G)` OIL;
- `(S,G,rpt)` prune prevents the RPT copy of `S`;
- other sources for the same ASM group may still use `(*,G)`.

For latency-sensitive market data, record packet loss, duplication, reordering, and maximum convergence time—not just whether the final state is correct.
