# Route-Reflector Roles

A route reflector (RR) relaxes iBGP split horizon for configured **clients**.

Simplified advertisement rules:

- A client-learned route may be reflected to other clients and non-clients.
- A non-client-learned iBGP route may be reflected to clients.
- A non-client route is not reflected to another non-client.
- eBGP routes can be advertised according to normal iBGP policy.

Clients do not require a full mesh with one another. Redundant RRs remove a single control-plane dependency.

An RR selects paths from its own viewpoint. Session scale improves, but clients may lose visibility of alternatives.

---

