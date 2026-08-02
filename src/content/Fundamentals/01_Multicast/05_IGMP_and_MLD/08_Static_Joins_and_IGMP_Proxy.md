# Static joins and IGMP proxy

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Static membership

A static membership forces multicast interest independent of dynamic host reports. Depending on the platform, a static command may:

- Make the router itself receive a group.
- Keep an outgoing interface in the multicast forwarding entry.
- Program a snooping port.
- Originate upstream PIM state.

These are not interchangeable. Read the platform's exact command semantics.

Static state is useful for a controlled test or an appliance that cannot signal membership, but it can mask broken IGMP, keep unwanted traffic flowing, and invalidate leave tests.

## IGMP proxy

An IGMP proxy:

1. Learns membership on one or more downstream interfaces.
2. Aggregates that state.
3. Sends corresponding membership reports on one upstream interface.
4. Forwards received multicast downstream according to learned interest.

It fits a tree-shaped access design with a clear upstream. It does not calculate arbitrary routed multicast paths and is not a general replacement for PIM.

## Version translation and SSM mapping

A proxy may report upstream using a different version from the downstream host. That can alter source-filter information.

Some routers map a v1/v2 group-only join to a statically configured source for SSM transition. This produces an `(S,G)` upstream state from a legacy `(*,G)` request, but the host did not natively signal S. Treat the source mapping as configured policy and document it explicitly.

## Troubleshooting test

When static state or a proxy exists, identify which device generated the report seen upstream. A correct upstream report does not prove the original receiver sent a correct message.

