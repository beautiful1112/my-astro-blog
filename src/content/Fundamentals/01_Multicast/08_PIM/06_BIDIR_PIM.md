# Bidirectional PIM

BIDIR-PIM builds one bidirectional shared tree per group, rooted at an RP **address**. Any source can inject data upward on the tree, and the traffic then travels down all interested branches. The core can avoid per-source `(S,G)` state, which suits many-to-many applications with many sources.

## How it differs from PIM-SM ASM

| Property | PIM-SM ASM | BIDIR-PIM |
|---|---|---|
| tree direction | unidirectional RPT, optional source SPT | one bidirectional shared tree |
| source registration | PIM Registers to actual RP | none |
| core source state | `(S,G)` possible/normal | shared `(*,G)` forwarding state |
| SPT switchover | supported | not part of BIDIR forwarding model |
| loop prevention on LAN | RPF and Assert | Designated Forwarder election per RP/link |

## RP address and rendezvous link

The RP address identifies the root direction through the MRIB. It does not always have to be assigned to a live router; some designs use a **phantom RP** address so routing points toward a resilient rendezvous link. RP mapping must explicitly mark the group range as BIDIR, and every router on the tree must support compatible BIDIR behavior.

## Designated Forwarder

On each link and for each RP, routers elect a Designated Forwarder (DF). Only the DF may forward packets from that link toward the RP, preventing loops when sources send onto a shared tree. The election uses advertised path information to the RP and a tie-breaker.

DF election is distinct from:

- PIM DR, which acts for local hosts in PIM-SM;
- PIM Assert, which reacts to duplicate unidirectional forwarding; and
- IGMP/MLD querier election.

Offer/Win/Lose/Pass DF messages and timers coordinate changes. A topology change must reconverge DF state as well as MRIB reachability.

## Data flow

1. Receiver membership causes `(*,G)` Join state toward the RP address.
2. A source sends natively onto its connected link—no Register tunnel is built.
3. The link's DF accepts/forwards the packet in the RP direction.
4. At each tree branch, data follows interested shared-tree interfaces away from the RP as well as progressing toward the root where required.
5. RPF/DF rules prevent a packet from circulating on the bidirectional tree.

## Trade-offs and operations

BIDIR-PIM reduces core state when many sources send to the same groups, but all traffic uses the shared tree, so path stretch can be permanent. Support, hardware forwarding, Anycast/phantom-RP design, DF election, and interoperability are less universal than PIM-SM/SSM.

Troubleshoot group mapping/mode, MRIB toward RP address, DF winner on every link, `(*,G)` tree state, and native data direction. Looking for Registers or `(S,G)` SPT state is the wrong workflow.

It is rarely the first choice for one-to-many low-latency market data, where SSM provides a direct source tree with simpler semantics.

