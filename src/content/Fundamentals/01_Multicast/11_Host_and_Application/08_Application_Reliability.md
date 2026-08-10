# Reliability above IP multicast

IP multicast delivers best-effort datagrams. Correct books and strategies require an application reliability layer on top.

Common mechanisms:

- packet/message sequence numbers;
- redundant A/B multicast feeds;
- first-copy arbitration and duplicate suppression;
- unicast retransmission for small gaps;
- snapshot/recovery feed for large gaps or late starts;
- heartbeat, session, and reset messages;
- forward-error correction in some media systems;
- explicit stale-state rules when recovery exceeds a budget.

Ordinary ACKs do not scale: thousands of receivers can create feedback implosion, and one slow receiver should not throttle the group.

## Layering

```text
Network multicast:  deliver copies, drop on congestion
A/B arbitration:    earliest good sequence wins
Gap detect:         expected++ mismatch
Small gap:          unicast rewind / retransmit request
Large gap / join:   snapshot or refresh channel
Stale rule:         pause trading / mark book invalid
```

Related: [A/B arbitration](../12_Quant_Trading_Market_Data/03_AB_Line_Arbitration.md), [Gap recovery lab](../18_Labs/06_Gap_Recovery.md).

## Mechanism comparison

| Mechanism | Strength | Limit |
|---|---|---|
| Sequence numbers | Detect loss/reorder | Need wrap and session rules |
| A/B feeds | Path diversity | Shared fate if not independent |
| Unicast replay | Precise fill | RTT; request storms under mass loss |
| Snapshot | Fast resync | Coarser; book rebuild cost |
| FEC | Repair without RTT | Bandwidth overhead; complexity |

## Configuration patterns (application / ops)

No router CLI replaces this layer, but ops should expose knobs consistently:

```text
# Example receiver policy (conceptual)
gap_timer_ms=2
reorder_window=32
replay_max_msgs=64
snapshot_threshold_gaps=20
stale_after_ms=50
```

Network side: ensure recovery **unicast** paths and ACLs allow the rewind servers independently of multicast boundaries.

### ACL sketch for recovery unicast

```text
! Permit receivers in 198.51.100.0/24 to contact rewind at 192.0.2.50
permit tcp 198.51.100.0 0.0.0.255 host 192.0.2.50 eq 4001
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **SSM allowlists** | Do not block snapshot/retransmit unicast |
| **QoS** | Protect multicast **and** recovery control |
| **Clock sync** | Skew metrics need PTP-aligned stamps |

## Verification

1. Inject single-packet loss on A only—B fills; no replay.
2. Loss on A and B—gap timer fires; unicast rewind succeeds.
3. Large burst loss—snapshot path; book resets cleanly.
4. Disable recovery—confirm stale rule engages (safe fail).

```text
# App metrics (example names)
gaps_a, gaps_b, gaps_after_arb, replay_ok, snapshot_ok, stale_events
```

## Risks

- Infinite reorder buffers hiding latency as “no gaps.”
- Recovery traffic sharing the congested multicast uplink.
- Undefined behavior when replay overlaps live sequences.

## Interview framing

“Multicast is best-effort delivery; trading correctness comes from sequences, independent A/B arbitration, bounded gap recovery, and explicit stale rules—not from UDP itself.”

---
