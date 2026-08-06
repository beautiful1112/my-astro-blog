# Report suppression in IGMP versions

## IGMPv1 and IGMPv2

Reports are sent to the multicast group G. Other group members can hear them.

If a host has a pending timer for G and hears another valid v1/v2 Report for G, it cancels its timer. Normally only one host reports each group per query cycle.

Benefits:

- Less control traffic.
- Router needs only “some listener exists” state.

Limitations:

- Router cannot infer all individual listeners.
- A snooping switch must ensure report visibility or compensate in its own state model.
- The last reporter may not be the only listener.

## IGMPv3

Host report suppression is removed. Every host sends its own report response.

Reasons:

- Reports can contain different source filters.
- Routers may track per-host state for accounting or fast leave.
- Suppression behaves poorly across snooping bridges that constrain report flooding.
- One v3 packet can bundle multiple group records, reducing packet count.

## Important distinction

Random response delay still exists in IGMPv3 to spread CPU/network load. “No suppression” does not mean all hosts respond at the same instant.

## Capture implication

- One v2 Report for G does **not** mean one receiver.
- Multiple v3 Reports for the same group are expected.
- A switch may proxy or aggregate reports, so capture location matters.

Primary reference: [RFC 3376, Appendix A.2](https://www.rfc-editor.org/rfc/rfc3376.html#appendix-A.2).

