# PIM control-plane facts

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

PIM builds multicast trees by following reachability supplied by the multicast routing information base (MRIB). It is **protocol independent** because the MRIB can come from an IGP, static multicast routes, or multiprotocol BGP; PIM is not tied to one unicast routing protocol.

## Wire behavior

- PIM version 2 is carried directly in IP protocol **103**, not TCP or UDP.
- Link-local messages normally use TTL/Hop Limit 1 and destination `224.0.0.13` for IPv4 or `ff02::d` for IPv6.
- Registers and Register-Stops are unicast between a source-side DR and an RP. Most other PIM-SM messages are link-local.
- Every PIM message begins with Version, Type, Reserved, and Checksum fields. The checksum normally covers the complete PIM message; for a Register it covers the first eight bytes—the PIM header plus Register header—rather than the encapsulated multicast packet.

Important PIM-SM message types are Hello, Register, Register-Stop, Join/Prune, Bootstrap, Assert, and Candidate-RP-Advertisement. Not every deployment uses every type.

## Neighbor and tree state are soft state

Hellos discover neighbors, advertise capabilities, detect a neighbor restart through the Generation ID, and participate in Designated Router election. Join/Prune messages create downstream interest one hop at a time and are refreshed periodically. If refreshes stop, the state expires; a Prune accelerates removal but is not the only cleanup mechanism.

The RFC defaults are commonly:

| Item | RFC default | Purpose |
|---|---:|---|
| Hello period | 30 seconds | neighbor refresh |
| Hello holdtime | 105 seconds | neighbor expiry (`3.5 × Hello period`) |
| Join/Prune period | 60 seconds | tree-state refresh |
| Join/Prune holdtime | 210 seconds | downstream state expiry |

Vendors may implement faster neighbor detection, explicit tracking, or different configurable timers. Verify the negotiated and operational values rather than assuming the defaults.

## DR election

One PIM Designated Router acts for directly connected hosts on a multiaccess LAN:

- on a source LAN, the DR originates PIM Registers for local ASM sources;
- on a receiver LAN, the DR normally creates upstream PIM state for local membership;
- if every neighbor advertises the DR Priority Hello option, highest numeric priority wins;
- otherwise the highest primary IP address wins, which preserves compatibility with older neighbors.

DR election is per interface/LAN. It is not an IGP election and does not necessarily select the router with the best path. Loss of Hellos or a Generation ID change can trigger a new election and rebuilding of state.

## What a neighbor proves—and does not prove

A PIM adjacency proves only that the two interfaces can exchange compatible Hellos. It does **not** prove:

- that every routed interface has PIM enabled;
- that the MRIB selects that neighbor for the source or RP;
- that all routers map the group to the same RP;
- that a receiver created `(*,G)` or `(S,G)` state;
- that the OIL is non-empty; or
- that the MFIB/ASIC programmed replication correctly.

Troubleshoot adjacency, topology/RPF, tree state, and hardware forwarding as separate layers.

