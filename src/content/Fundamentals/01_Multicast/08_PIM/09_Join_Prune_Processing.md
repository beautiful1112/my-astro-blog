# PIM Join/Prune processing

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

PIM Join/Prune messages create and remove multicast tree state one hop at a time. A message is sent to the all-PIM-routers group on a link but contains the address of the **upstream neighbor** that must process the request.

## Message organization

A single message can carry multiple group sets. For each encoded group it contains a joined-source list and a pruned-source list. Encoded-source flags give the address different meanings:

| Source encoding | Meaning |
|---|---|
| wildcard + RPT | `(*,G)` shared-tree state; encoded address identifies the RP |
| source only | `(S,G)` source-tree state |
| source + RPT | `(S,G,rpt)` prune relative to the shared tree |

The Holdtime tells the upstream router how long to keep downstream state. Large messages may need group-set fragmentation; loss of one fragment can temporarily leave only part of the intended state.

## Building upstream state

Suppose R3 has a receiver-facing OIF and its RPF neighbor toward the root is R2:

```text
root (RP or S) --- R1 --- R2 --- R3 --- receiver
```

R3 sends a Join naming R2. R2 creates downstream state on the R2-R3 interface. If this is R2's first interested downstream, R2 sends its own Join naming R1. If R2 already had another interested branch, the new branch merges locally and no additional upstream state type is required.

Joins follow the current MRIB toward the root:

- `(*,G)` follows the RP address;
- `(S,G)` follows the source;
- `(S,G,rpt)` is propagated toward the RP according to its prune state rules.

## Prune behavior

A downstream Prune removes only that downstream neighbor/interface's interest after LAN coordination. It must not remove other local receivers or other downstream branches. If the router has no remaining interest, it can propagate a Prune upstream.

On point-to-point links, removal can be direct. On multiaccess LANs, another downstream router may still require the flow, so the upstream waits an override interval for a Join. Explicit tracking can reduce ambiguity where universally supported.

## Soft-state refresh

Periodic Joins refresh the Holdtime. State disappears when:

- an effective Prune is processed;
- the Holdtime expires without refresh;
- the downstream PIM neighbor disappears;
- local membership and all inherited interest disappear; or
- policy/topology changes invalidate it.

A lost Prune generally causes unwanted traffic until timeout; a lost Join can cause an interruption until the next triggered or periodic refresh. This asymmetry favors continuity over aggressive removal.

## RPF change

When the MRIB changes the upstream neighbor for a tree root, the router should move upstream state:

1. compute the new RPF interface and neighbor;
2. send a Join on the new path promptly;
3. remove or Prune the old path according to the state machine;
4. update the expected data IIF; and
5. avoid accepting duplicates from both paths longer than required.

During convergence, control packets and data may take different transient paths. Correlate MRIB events with Join/Prune and RPF-drop counters.

## Reading a capture

For each Join/Prune packet record:

1. sender and receiving interface;
2. named upstream-neighbor address;
3. group and mask;
4. source address and WC/RPT flags;
5. joined versus pruned list;
6. Holdtime; and
7. whether the receiving router installed/removed downstream OIF state.

Seeing `G` in a packet is insufficient—the source flags determine whether it is shared-tree, source-tree, or RPT-prune signaling.
