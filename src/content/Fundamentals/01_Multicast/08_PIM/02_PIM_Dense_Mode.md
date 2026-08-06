# PIM Dense Mode

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

PIM Dense Mode assumes receivers are present on most branches. It starts from data and removes unwanted branches, the opposite of sparse mode's explicit-join behavior.

## Flood-and-prune process

1. A source starts sending. Its DR forwards traffic to all PIM-DM interfaces except the RPF incoming interface.
2. Each router accepts the flow only if it arrived on the RPF interface toward `S`, then floods it further.
3. A leaf router with no local membership or downstream interest sends an `(S,G)` Prune upstream.
4. When an upstream router has pruned every downstream branch, it propagates a Prune toward the source.
5. The remaining interfaces form a source-rooted forwarding tree.
6. Prune state is temporary. On expiry, traffic can reflood and unused branches prune again.

Dense-mode state is source-specific; there is no RP, Register, shared `(*,G)` discovery tree, or ASM SPT switchover.

## Graft

If a receiver appears on a pruned branch, the last-hop router sends a Graft upstream rather than waiting for prune expiry. Each router acknowledges with Graft-Ack and propagates the Graft until it reaches active forwarding state. Data then resumes down the new branch.

Graft retransmission handles a lost Graft or acknowledgment. A working membership join with no successful upstream Graft produces delay until the control exchange succeeds or prune state expires.

## State refresh

The original PIM-DM design depended on periodic reflooding as soft-state recovery. The optional State Refresh mechanism lets the source DR originate refresh messages so prune state can remain without repeated data floods. Support and interoperability must be confirmed across the complete domain.

## Assert and multiaccess links

Several RPF-valid routers can forward the same stream onto a shared LAN. PIM Assert selects one forwarder per `(S,G)` based on route preference, metric, and address. DR election does not decide this.

## Trade-offs

| Strength | Cost |
|---|---|
| no RP/source-registration design | initial traffic reaches every RPF-valid branch |
| receiver can recover with Graft | per-source state and Graft reliability |
| reasonable in a small truly dense domain | periodic reflood or State Refresh complexity |
| simple source-rooted data path | unwanted high-rate traffic before pruning |

PIM-DM is a poor default for sparse high-rate market-data receivers: even short refloods can congest unused branches, and a new source creates state throughout the domain before interest is known.

Troubleshoot source RPF, prune state/timers, Graft/Graft-Ack, Assert winner, and whether every router supports the same State Refresh behavior.

