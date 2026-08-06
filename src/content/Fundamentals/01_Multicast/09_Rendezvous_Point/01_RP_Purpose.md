# Rendezvous Point purpose

An RP solves ASM's discovery problem. A receiver knows only group `G`, while a source knows neither the receivers nor their locations. A common group-to-RP mapping gives both sides a deterministic meeting point:

- receiver `(*,G)` Joins travel toward `RP(G)`;
- a source-side DR sends Registers to `RP(G)`;
- the RP learns `(S,G)`, joins the source if receivers exist, and places initial data onto the shared tree.

## Control anchor versus data path

The RP is the root of the RP tree and the initial source-discovery anchor. It need not remain in the steady-state data path:

```text
Discovery/RPT: source -> RP -> receiver
After SPT:     source --------> receiver
```

The RP can therefore have three different roles for one group at the same time:

1. root of `(*,G)` control state;
2. endpoint for PIM Registers from newly active sources; and
3. transit/branch point for receivers that have not switched to an SPT.

## What every router must agree on

For a given ASM group, routers need a consistent mapping to an RP address and usable MRIB reachability to that address. They do not all need identical unicast paths, but mismatched RP mappings can create disjoint shared trees:

- LHR joins RP-A;
- FHR registers source to RP-B;
- without an Anycast synchronization or MSDP mechanism joining those source and receiver domains, they never meet.

The mapping is group-specific. Different group prefixes can use different RPs, and more-specific mappings normally take precedence according to the mechanism/implementation.

## RP state and load

Capacity planning must include:

- active groups and sources;
- Register packet rate and decapsulation work;
- native `(S,G)` joins from the RP;
- shared-tree fan-out and data rate for RPT-resident receivers;
- BSR/Auto-RP/MSDP control state where used;
- churn from source and receiver changes; and
- control-plane policing and hardware punt behavior.

Moving receivers quickly to SPT reduces steady-state RP data load, but it does not remove RP dependence for **new ASM discovery**.

## Failure signature

RP failure can be deceptively partial:

| Flow condition | Possible result after RP failure |
|---|---|
| established SPT | continues because data bypasses RP |
| receiver staying on RPT | loses data or converges to rebuilt RPT |
| new receiver | cannot construct a useful shared tree until mapping/reachability recovers |
| new source | Registers fail or reach an unsynchronized RP |
| existing source after state expiry | can fail later when registration/source discovery is needed again |

For this reason, test established flows, new receivers, new sources, and source restart separately.

SSM removes this entire rendezvous function because the receiver already knows `S` and joins the source directly.

