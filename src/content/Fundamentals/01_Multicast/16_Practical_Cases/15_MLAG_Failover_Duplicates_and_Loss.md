# Case 15: MLAG multicast failover causes duplicates followed by loss

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Symptom

During failure of Switch A's upstream link, a dual-homed receiver sees duplicate sequences for 80 ms, then a 600 ms gap, then normal traffic through Switch B. Unicast converges cleanly.

## Event sequence

1. A's upstream multicast path fails.
2. B begins forwarding using its local uplink.
3. stale state still sends a peer-link copy from A or both peers replicate to the receiver LAG—duplicates.
4. MLAG/STP synchronization flushes or replaces listener/mrouter state.
5. neither peer has a complete listener-to-uplink replication list—loss.
6. an unsolicited Report, Query response, or state sync rebuilds B's entry.

## Evidence to collect

- packet sequence and source MAC on both receiver members;
- ingress/uplink and peer-link captures on both switches;
- listener and mrouter port state with reasons/timers;
- MLAG/DF role timeline;
- ASIC replication object before, during, and after failure;
- querier state and any membership refresh packet.

Unicast LACP/MLAG status cannot explain multicast listener or replication state.

## Design corrections

- synchronize the required snooping/mrouter state or ensure both peers observe Reports;
- define peer-link data behavior under orphan/uplink failures;
- prevent both peers from forwarding to the same dual-homed segment;
- retain membership through topology changes when supported;
- ensure strict unknown-multicast drop does not black-hole the relearn interval;
- size the peer link for failure-state multicast fan-out.

## Validation

Repeat access-member, uplink, peer-link, chassis, and querier failures. Score loss and duplicates separately; “recovered in under one second” hides the two different failure modes.
