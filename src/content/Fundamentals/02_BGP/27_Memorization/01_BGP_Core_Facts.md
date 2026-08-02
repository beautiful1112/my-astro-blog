# BGP Core Facts to Memorize

- BGP-4 base specification: RFC 4271.
- Transport: TCP port 179.
- FSM: Idle, Connect, Active, OpenSent, OpenConfirm, Established.
- Message types: OPEN, UPDATE, NOTIFICATION, KEEPALIVE; ROUTE-REFRESH is an extension.
- Classic maximum message length: 4096 octets; Extended Messages can raise it to 65535.
- Four-octet compatibility ASN: AS_TRANS 23456.
- Full-mesh iBGP sessions: n(n - 1) / 2.
- Higher LOCAL_PREF wins.
- Shorter AS_PATH usually wins.
- Lower MED usually wins within the configured comparison scope.
- Best BGP route is not necessarily installed.
- Longest-prefix match is a forwarding decision across different prefix lengths.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
