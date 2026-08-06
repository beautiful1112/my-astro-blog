# IGMP/MLD snooping complete process

IGMP/MLD snooping constrains Layer-2 multicast by observing membership control traffic. It is not a routing protocol: it derives `(VLAN,G)` or `(VLAN,S,G)` replication state inside a bridge domain.

## State the switch needs

For each VLAN or bridge domain, a snooping switch commonly tracks:

- membership version and querier information;
- multicast-router ports (mrouter ports);
- listener ports per group and optionally source filter;
- membership/last-member timers;
- static ports and immediate-leave policy;
- unknown-multicast forwarding policy; and
- hardware replication entries and resource use.

## Join process

1. A host transmits an IGMP/MLD Report on its access port.
2. The switch validates/snoops the report and adds that port to the listener set for `G` or `(S,G)`.
3. The report is forwarded toward all known mrouter ports. Depending on implementation it may also be proxied, aggregated, or suppressed.
4. The switch programs a hardware replication entry containing listener ports plus any required router ports.
5. Data matching the entry is copied only to eligible ports.

A receiver may send unsolicited reports more than once to reduce join loss. First-packet behavior still depends on control processing and hardware-programming latency.

## Query and refresh

The querier sends General Queries. The switch forwards them to listener-facing ports according to snooping rules. Hosts refresh their state with Reports, and the switch refreshes port membership.

If no valid querier exists, old listener state eventually expires. Data may then flood as unknown multicast or be dropped, depending on policy. This creates the classic “works after join, then stops” symptom.

## Leave process

For an IGMPv2 Leave or corresponding MLD state change:

1. the switch/router does not normally remove a shared port immediately;
2. group-specific or group-and-source-specific queries test for remaining listeners;
3. reports from any remaining listener preserve the port;
4. only after the last-member query sequence expires is the port pruned.

Immediate/fast leave skips this check. It is safe only if one independently enforced listener can exist behind the port.

IGMPv3/MLDv2 state changes can add/remove sources while preserving group membership. A switch that supports only group-level snooping may still forward all sources for `G` at Layer 2 and rely on the router/host to filter.

## Control-packet forwarding

Membership reports must reach mrouter ports. Queries must reach host ports. PIM, routing/control groups, and link-local multicast often require special handling regardless of ordinary listener state. Over-filtering `224.0.0.0/24` or IPv6 link-local multicast can break the very control protocols needed to maintain snooping.

## Data forwarding

Known data is replicated to the programmed listener set and required router ports. Unknown multicast policy is platform-specific:

- flood within the VLAN;
- flood only to mrouter/static ports;
- drop; or
- rate-limit/punt while resolving state.

Strict drop reduces unwanted load but increases sensitivity to report loss, hardware programming delay, and source-before-receiver races.

## Topology changes

STP, MLAG, EVPN, port-channel, and VLAN changes can invalidate learned port state. A correct implementation flushes/relearns or synchronizes entries; during convergence it may flood, drop, or duplicate. Verify peer-link behavior and state replication rather than assuming ordinary MAC-learning behavior applies.

## Verification sequence

1. Confirm the VLAN has a live querier and expected membership version.
2. Confirm mrouter ports and how each was learned.
3. Confirm the host Report arrived on the expected access port.
4. Confirm the logical `(VLAN,G[,S])` entry and timer.
5. Confirm the ASIC replication list matches it.
6. Send sequenced data and compare ingress/egress counters.
7. Test leave, host silence, querier failure, uplink failure, and topology change.

The most important distinction is between **control state learned**, **hardware state programmed**, and **data actually replicated**.
