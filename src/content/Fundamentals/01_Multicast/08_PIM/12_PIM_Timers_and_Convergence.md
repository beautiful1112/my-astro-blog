# PIM timers and convergence

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

PIM is mostly soft state. Timers provide recovery when explicit control messages are lost, while triggered messages make normal changes faster. The RFC values below are reference defaults; platform features and configuration can change effective behavior.

| Function | Common RFC value | Failure it detects or bounds |
|---|---:|---|
| Hello period | 30 s | neighbor/capability refresh |
| Hello holdtime | 105 s | silent neighbor expiry |
| triggered Hello delay | randomized up to 5 s | Hello synchronization and neighbor discovery |
| Join/Prune period | 60 s | upstream tree refresh |
| Join/Prune holdtime | 210 s | stale downstream interest |
| Register suppression | 60 s, randomized on use | pause data Registers after Register-Stop |
| Register probe | 5 s | Null-Register response window |
| Assert time | 180 s | stale shared-LAN forwarder election |

Do not memorize a timer without its state. The same CLI may show expiry for neighbor, downstream Join, Assert, source activity, or Register suppression.

## Triggered versus periodic behavior

- a new receiver should trigger a Join rather than wait for the periodic timer;
- a departing final receiver should trigger a Prune after membership processing;
- a changed MRIB next hop should move Join state promptly;
- a changed Hello Generation ID should trigger state refresh;
- periodic refresh remains the safety net for lost control messages.

## Multiaccess convergence

Immediate pruning on a LAN can remove traffic still needed by another router. Join suppression, prune override, LAN propagation delay, and explicit tracking coordinate the shared link. The effective prune delay can be governed by the slowest advertised LAN parameters.

## Faster failure detection

Reducing Hello/Holdtime values detects neighbor loss faster but increases control traffic and sensitivity to CPU scheduling or congestion. Some platforms integrate PIM with BFD or routing fast-convergence features. Fast adjacency detection is useful only if:

1. the MRIB installs a usable alternate path;
2. Join state moves to it;
3. upstream routers accept the new downstream state; and
4. the MFIB updates without resource/programming delay.

## Convergence test matrix

Test at least:

- lost PIM neighbor on a transit link;
- source-side DR failure;
- receiver-side DR failure;
- IGP next-hop change without PIM adjacency loss;
- RP route withdrawal and Anycast-RP movement;
- RP process restart with stable loopback reachability;
- Assert winner failure on a shared LAN; and
- lost Join, Prune, Register-Stop, and Bootstrap messages.

For each test measure first lost sequence, last lost sequence, duplicates, out-of-order delivery, control-state recovery, MFIB recovery, and whether a new receiver/source behaves differently from an established SPT flow.
