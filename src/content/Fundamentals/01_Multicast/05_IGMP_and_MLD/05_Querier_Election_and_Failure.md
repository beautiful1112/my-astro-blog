# Querier election and the works-then-stops failure

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Election

Every IGMPv2/v3 multicast router initially considers itself the querier. A router that hears a valid General Query from a **lower source IPv4 address** becomes non-querier. If that lower-address querier is not heard for the Other Querier Present Interval, the router resumes querying.

The election compares the IPv4 source addresses of queries; it does not use PIM DR priority, STP root status, interface MAC address, or router ID.

## Startup behavior

On startup, the querier sends **Startup Query Count** General Queries at the shorter **Startup Query Interval**. This rebuilds link state faster than waiting a full Query Interval.

## Failure timeline

With defaults:

1. Querier fails.
2. Non-querier waits approximately 255 seconds.
3. Backup declares the old querier absent.
4. Backup begins sending General Queries.

Existing router group state can remain until its membership timers expire. Exact traffic impact also depends on PIM and snooping state.

## “Works, then stops” failure

An L2-only VLAN may have snooping enabled but no multicast router and no snooping querier:

1. Application joins and sends unsolicited reports.
2. Switch learns receiver ports.
3. Nobody sends periodic General Queries.
4. Snooping membership ages out.
5. Traffic stops even though the application is still joined.

The signature is traffic recovery immediately after an application rejoin, switch clear, or manually generated query, followed by another failure near the membership-aging interval.

Provide a redundant and deliberately placed querier. Disabling snooping replaces missing control state with uncontrolled flooding; it does not repair the protocol design.

