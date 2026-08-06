# BGP Route Leaks

RFC 7908 describes route leaks as propagation beyond the intended scope. A classic leak exports provider- or peer-learned routes to another provider or peer, making the leaking AS unintended transit.

Consequences include:

- Traffic detours and congestion.
- Packet loss through an under-capacity network.
- Policy violations.
- Apparent hijacking even when the origin ASN is legitimate.

RPKI origin validation may report leaked routes as Valid because the origin did not change. Prevent leaks with relationship-aware import/export policy, community controls, maximum-prefix limits, monitoring, and BGP Roles/OTC.

---

