# Layer-2 multicast hardware scaling and replication

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Switch multicast scale is multidimensional. A platform that supports many groups may still fail because it lacks source-specific entries, replication-list objects, fan-out bandwidth, or update rate.

## Hardware objects

An ASIC may program combinations of:

- `(VLAN,G)` or `(VLAN,S,G)` lookup entries;
- destination-MAC multicast entries;
- replication-list or multicast-group IDs;
- per-port VLAN rewrite objects;
- tunnel/VTEP replication lists;
- router-interface copies/punts;
- shared buffer/egress queue resources;
- counters and policers.

Several flows can share one replication list if they have identical OIFs. A single membership change may require allocating a new list, updating many flows, or performing a copy-on-write operation.

## Scale dimensions

| Dimension | Example question |
|---|---|
| groups | how many `(VLAN,G)` entries? |
| sources | can one group expand into thousands of `(S,G)` entries? |
| VLANs/BDs | is the same `G` counted once or once per VLAN? |
| fan-out | maximum ports/VTEPs per replication list? |
| list diversity | how many unique OIF combinations exist? |
| churn | how many joins/leaves or OIF updates per second? |
| replication bandwidth | aggregate internal and egress copies at peak? |
| counters | per-flow counters available or shared? |
| IPv4/IPv6 sharing | do IGMP and MLD consume one common table? |
| L2/L3 sharing | does snooping compete with routed MFIB resources? |

Published “multicast routes” often describe only one of these.

## MAC versus IP lookup

IPv4 maps 32 IP multicast groups onto one Ethernet multicast MAC. A MAC-based hardware entry cannot distinguish those groups and may send all aliases to the union of interested ports. IP-based snooping entries avoid this over-delivery but consume IP multicast table resources.

Measure unwanted pps at the receiver NIC even when the intended `(S,G)` is correct; alias traffic can exhaust a host before the link is full.

## Resource exhaustion behavior

On exhaustion, a platform may:

- reject new memberships;
- flood the affected group;
- drop unknown/new groups;
- program group-only instead of source-specific state;
- punt packets or control messages to CPU;
- reuse/coarsen replication lists;
- log only a generic hardware-programming failure.

Know the behavior before production. Flooding is availability-friendly but can create a larger congestion failure; dropping is containment-friendly but black-holes new receivers.

## Replication performance

A 1 Gb/s input replicated to 48 egress ports consumes approximately 48 Gb/s of egress traffic plus internal fabric work. The ingress port can be lightly utilized while a shared egress buffer or replication engine is saturated.

Test:

- worst-case simultaneous channels, not one group;
- smallest packet size and peak pps;
- maximum fan-out;
- coincident join/leave churn;
- failure-state peer-link/tunnel copies;
- mixed IPv4/IPv6 and L2/L3 multicast;
- control-plane responsiveness during data bursts.

## Observation

Correlate logical snooping entries with hardware table utilization, replication object counts, programming failures, internal/fabric drops, egress queue watermarks, and host-visible sequences. A correct software table is not evidence that the ASIC admitted the entry.
