# Multicast scope and TTL

- Address scope defines where a group is valid and must be bounded.
- TTL limits the routed hop count of a particular IPv4 packet; IPv6 uses Hop Limit.
- `224.0.0.0/24` is never routed regardless of TTL.
- TTL 1 does not stop Layer-2 flooding across a large bridged VLAN.
- TTL thresholds are a coarse legacy mechanism, not a substitute for boundaries, ACLs, and routing design.

Use enough TTL for the intended path, then enforce scope with explicit network policy.

