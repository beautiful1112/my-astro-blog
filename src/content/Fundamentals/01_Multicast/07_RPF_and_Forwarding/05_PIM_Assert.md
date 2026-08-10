# PIM Assert on shared LANs

**PIM Assert** (RFC 7761) prevents duplicate forwarding when more than one router sends the same multicast flow onto a multiaccess LAN. It is a reactive, per-tree election triggered when a router receives a packet from that LAN even though the LAN is in its own outgoing-interface list.

```text
          R1 ---- upstream path
         /  \
receiver LAN \  both initially forward (S,G)
         \  /
          R2 ---- upstream path
```

## Message interaction

1. Both R1 and R2 have the LAN in OIL and forward `(S,G)`.
2. Each hears the other’s forwarded packet on an OIF → Assert trigger.
3. Both send **Assert** messages with metric tuples.
4. Winner keeps forwarding; loser removes the LAN from effective OIL for that tree.
5. Winner refreshes; state expires (Assert Time, commonly 180s) or **AssertCancel** ends it early.

```mermaid
sequenceDiagram
    participant R1
    participant LAN
    participant R2
    R1->>LAN: data (S,G)
    R2->>LAN: data (S,G)
    R1->>LAN: Assert(metric1)
    R2->>LAN: Assert(metric2)
    Note over R1,R2: Winner continues; loser prunes LAN from OIL
```

## Election tuple

Each forwarder advertises:

1. whether its route is toward the RP tree or source tree;
2. MRIB route preference to the tree root;
3. MRIB metric to the tree root; and
4. its own IP address as final tie-breaker.

The preferred path wins: an **SPT metric preferred over RPT** for the source flow, then **lower** route preference, then **lower** route metric, then **higher** IP address. The RPT bit in the Assert metric is therefore semantically important.

The loser removes the LAN from effective forwarding for that tree while Assert state remains. It can still be DR, IGMP querier, or winner for a different `(S,G)`.

## State and expiry

Per-interface Assert state is commonly NoInfo, Winner, or Loser. Stale state expires (RFC default Assert time 180 seconds). An AssertCancel or topology/state change can end the election earlier.

An Assert can also influence the upstream/RPF neighbor used on a multiaccess network. Inspect both forwarding suppression and the selected Assert winner when the apparent MRIB neighbor alone does not explain state.

## Common causes

- two routers have downstream interest on the same receiver LAN;
- parallel upstream paths both initially forward to a shared transit LAN;
- duplicate `(*,G)` and `(S,G)` forwarding during tree transition;
- inconsistent metrics or delayed state after routing convergence;
- a Layer-2 loop unexpectedly makes a router hear its own downstream flow.

## DR versus Assert

| Election | Chooses | Granularity | Normal trigger |
|---|---|---|---|
| PIM DR | router acting for connected sources/receivers | whole interface/LAN | Hellos |
| PIM Assert | forwarder onto LAN | each `(S,G)` or applicable `(*,G)` | duplicate data |

DR priority does **not** decide Assert. Making a router DR therefore does not guarantee it forwards every multicast stream onto that LAN.

Related: [PIM Hello and DR](../08_PIM/08_PIM_Hello_DR_and_LAN.md), [OIL inheritance](07_Forwarding_Rules_and_OIL_Inheritance.md).

## Configuration patterns

Assert is automatic when PIM runs on multiaccess interfaces; tune only with care.

### Cisco IOS / IOS XE

```text
interface Vlan200
 ip address 198.51.100.1 255.255.255.0
 ip pim sparse-mode
 ! DR priority ≠ Assert winner
 ip pim dr-priority 10
!
show ip pim interface Vlan200 detail
show ip mroute 232.10.10.10
```

### Junos

```text
set protocols pim interface irb.200 mode sparse
set protocols pim interface irb.200 priority 10
show pim join extensive
show multicast route extensive
```

### FRRouting

```text
interface vlan200
 ip pim
 ip pim drpriority 10
!
show ip mroute
show ip pim interface detail
```

There is rarely an “assert enable” knob—fix duplicates and metrics instead of disabling protection.

## Interactions

| Mechanism | Relationship |
|---|---|
| **IGMP querier** | Independent election |
| **DR** | Source Register / membership acting router |
| **SPT switchover** | Transient duplicates often trigger Assert |
| **MLAG / stacking** | Can create dual-active forwarders—design carefully |

## Verification

1. Confirm duplicates truly arrive from two router MAC addresses.
2. Identify whether the Assert is `(S,G)` or `(*,G)` and whether the RPT bit is set.
3. Compare route preference, metric, and address exactly as advertised.
4. Verify that the expected winner has a valid OIL and continues sending.
5. Check loser/winner expiry and churn; repeated elections often indicate unstable MRIB.
6. If the winner fails, measure how the loser resumes—Assert expiry may be slow.

```text
show ip mroute 192.0.2.10 232.10.10.10
show ip pim neighbor
tcpdump -eni eth0 ip proto 103
```

## Risks

- Silencing Assert symptoms without removing the duplicate topology.
- Assuming highest DR priority forwards all groups.
- Assert flaps from unstable IGP metrics on loss-sensitive feeds.

## Interview framing

“Assert elects one forwarder per tree on a shared LAN using SPT-vs-RPT, preference, metric, then highest IP—and it is not the same election as PIM DR.”

---
