# External Connectivity Design

Classify every external BGP session:

- Transit provider.
- Internet exchange route server.
- Bilateral peer.
- Exchange or broker private network.
- DDoS scrubbing provider.
- Cloud on-ramp.

For each, document authorized prefixes, expected count, next-hop behavior, relationship, LOCAL_PREF, communities, maximum prefix, RPKI policy, failover target, and physical failure domain.

Do not reuse a generic “external peer” policy across relationships. A route server, transit provider, and exchange private link have fundamentally different first-AS, export, and forwarding expectations.

---

