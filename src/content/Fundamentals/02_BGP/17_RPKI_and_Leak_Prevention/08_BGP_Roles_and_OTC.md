# BGP Roles and Only-to-Customer

RFC 9234 defines BGP Roles for eBGP relationships and the **Only-to-Customer (OTC)** attribute to help detect valley-free policy violations.

Roles include provider, customer, peer, route server, and route-server client. Peers negotiate compatible roles. OTC propagation rules mark routes that should only travel toward customers.

Benefits:

- Explicitly records relationship intent at session setup.
- Detects some leaks that RPKI origin validation cannot.
- Provides a protocol signal in addition to local community conventions.

Deployment requires compatible implementations and correct role assignment. It supplements explicit prefix/export policy rather than replacing it.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
