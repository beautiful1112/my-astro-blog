# IGMP/MLD security and message validation

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

IGMP and MLD normally trust on-link control messages. An on-link host can often join a group legitimately, so the main risks are control-plane load, false state, downgrade, and forged querier behavior.

## Forged Query

A lower-address forged Query can win querier election. If the sender then stays silent, normal takeover waits for the Other Querier Present Interval.

A forged Group-and-Source-Specific Query with a large source list can also create host processing load.

## Forged Report

A false Report can keep multicast forwarding toward a link with no real receiver. An older-version Report can place a router into compatibility mode:

- v1 presence can disable fast leave behavior.
- v2 presence can suppress v3 source-specific semantics for the group.

## Forged leave/state change

A Leave or BLOCK record should not immediately remove traffic needed by others. Last-member queries verify continuing interest, so the usual effect is extra query processing rather than immediate loss.

## Validation controls

- Enforce TTL/Hop Limit 1 and prevent routing of listener messages.
- Validate IPv4 Router Alert for v2/v3 according to compatibility policy.
- Require valid checksum and message length.
- Verify the source belongs to the receiving link; account for defined zero/unspecified startup cases.
- Use control-plane policing sized for legitimate query/report bursts.
- Apply IGMP/MLD snooping limits and access policy carefully.
- Disable older-version compatibility only when legacy listeners are explicitly unsupported.

Security policy must not block required destinations such as 224.0.0.22 or ff02::16.

Primary references: [RFC 3376, Section 9](https://www.rfc-editor.org/rfc/rfc3376.html#section-9) and [RFC 3810, Section 10](https://www.rfc-editor.org/rfc/rfc3810.html#section-10).
