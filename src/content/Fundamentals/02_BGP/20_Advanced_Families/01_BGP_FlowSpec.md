# BGP FlowSpec

FlowSpec distributes traffic-matching rules and actions through MP-BGP. Match components can include source/destination prefix, protocol, ports, TCP flags, and packet length. Actions can discard, rate-limit, redirect, or mark traffic.

Use cases include rapid DDoS mitigation and distributed filtering.

Risks are substantial: a broad or malformed rule can drop legitimate traffic across many routers. Apply:

- Strict source authorization.
- Rule validation.
- Scoped route targets or peers.
- Hardware-capacity limits.
- Precedence analysis against ACLs.
- Automatic expiry and audit.

FlowSpec is more selective than destination RTBH but operationally more complex.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
