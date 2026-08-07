# Layer-2 multicast redundancy: MLAG, stacks, and topology changes

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Layer-2 redundancy must synchronize more than the ordinary MAC table. A multicast flow depends on listener state, mrouter ports, querier state, replication entries, and loop-prevention/DF roles.

## Dual-switch receiver attachment

```text
                +-- Switch A -- upstream router A
Receiver/LAG ---|
                +-- Switch B -- upstream router B
                       A <== peer link/state ==> B
```

Both switches may receive Reports, data, or control traffic. The design must decide:

- which switch is querier;
- which ports are mrouter ports;
- whether listener state is synchronized or relearned;
- whether data crosses the peer link;
- which switch replicates onto the dual-homed segment;
- how duplicates are prevented;
- how an orphan port behaves when its local uplink fails.

## State synchronization models

1. **Independent snooping:** each chassis learns only locally observed Reports. Control traffic must reach both where both may forward.
2. **Peer synchronization:** listener and/or mrouter state is exchanged through an MLAG/stack control channel.
3. **Single logical switch:** a stack/chassis presents one control plane but still has distributed ASIC programming and internal-link failure modes.
4. **EVPN multihoming:** BGP synchronization and DF election coordinate membership across separate PEs.

Never infer the model from the fact that unicast MLAG works.

## Topology-change timeline

When an uplink or peer fails:

1. physical/LAG state changes;
2. STP/MLAG/DF state changes;
3. mrouter port may move or expire;
4. listener state is retained, synchronized, flushed, or relearned;
5. hardware replication list changes;
6. unknown multicast may temporarily flood or drop;
7. data resumes on the surviving path.

The order determines whether receivers see loss, duplication, or both. A switch that flushes membership before the next unsolicited Report can black-hole strict unknown-drop groups.

## Peer-link considerations

The peer link can carry:

- membership Reports/Queries needed by the remote control plane;
- multicast data for receivers reachable only through the peer;
- synchronized logical state but not user data; or
- both control and data during failure.

Size it for failure fan-out, not just normal unicast traffic. Avoid a design where independent A/B feeds converge onto one peer link after a single failure.

## Duplicate mechanisms

Duplicates can arise from:

- both upstream routers forwarding after stale Assert/DF state;
- both MLAG peers replicating to the same dual-homed receiver;
- data arriving through local uplink and peer link;
- old and new replication lists active simultaneously;
- an STP loop or temporary unknown-multicast flood.

Capture source MAC, ingress port, VLAN, sequence, and timestamp on both peers to distinguish them.

## Test matrix

- local access member failure;
- one switch reload/control-plane restart;
- peer-link failure with both switches alive;
- one upstream multicast-router failure;
- querier failure without data-path failure;
- orphan receiver on each peer;
- simultaneous receiver leave and topology change;
- membership state at hardware scale during failover.

Pass criteria must include maximum loss, duplicates, state-recovery time, peer-link load, and absence of delivery to unjoined ports.
