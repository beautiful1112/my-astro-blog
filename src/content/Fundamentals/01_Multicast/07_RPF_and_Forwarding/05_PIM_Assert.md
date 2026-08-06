# PIM Assert on shared LANs

PIM Assert prevents duplicate forwarding when more than one router sends the same multicast flow onto a multiaccess LAN. It is a reactive, per-tree election triggered when a router receives a packet from that LAN even though the LAN is in its own outgoing-interface list.

```text
          R1 ---- upstream path
         /  \
receiver LAN \  both initially forward (S,G)
         \  /
          R2 ---- upstream path
```

## Election tuple

Each forwarder advertises an Assert metric containing:

1. whether its route is toward the RP tree or source tree;
2. MRIB route preference to the tree root;
3. MRIB metric to the tree root; and
4. its own IP address as final tie-breaker.

The preferred path wins: an SPT metric is preferred over an RPT metric for the source flow, then **lower** route preference, then **lower** route metric, then **higher** IP address. The RPT bit in the Assert metric is therefore semantically important.

The loser removes the LAN from effective forwarding for that tree while Assert state remains. It can still be DR, IGMP querier, or winner for a different `(S,G)`.

## State and expiry

Per-interface Assert state is commonly described as NoInfo, Winner, or Loser. The winner refreshes/defends its status when needed; stale state expires (RFC default Assert time 180 seconds). An AssertCancel or topology/state change can end the election earlier.

An Assert can also influence the upstream/RPF neighbor used on a multiaccess network. Inspect both forwarding suppression and the selected Assert winner when the apparent MRIB neighbor alone does not explain state.

## Common causes

- two routers have downstream interest on the same receiver LAN;
- parallel upstream paths both initially forward to a shared transit LAN;
- duplicate `(*,G)` and `(S,G)` forwarding during tree transition;
- inconsistent metrics or delayed state after routing convergence;
- a Layer-2 loop or topology unexpectedly makes a router hear its own downstream flow.

## DR versus Assert

| Election | Chooses | Granularity | Normal trigger |
|---|---|---|---|
| PIM DR | router acting for connected sources/receivers | whole interface/LAN | Hellos |
| PIM Assert | forwarder onto LAN | each `(S,G)` or applicable `(*,G)` | duplicate data |

DR priority does not decide Assert. Making a router DR therefore does not guarantee it forwards every multicast stream onto that LAN.

## Troubleshooting

1. Confirm duplicates truly arrive from two router MAC addresses.
2. Identify whether the Assert is `(S,G)` or `(*,G)` and whether the RPT bit is set.
3. Compare route preference, metric, and address exactly as advertised.
4. Verify that the expected winner has a valid OIL and continues sending.
5. Check loser/winner expiry and churn; repeated elections often indicate unstable MRIB or duplicate data paths.
6. If the winner fails, measure how the loser resumes—Assert expiry may be too slow without a triggered state change.

Unexpected Assert activity is evidence of duplicate forwarding topology, not something to silence before finding why both routers sent the flow.

