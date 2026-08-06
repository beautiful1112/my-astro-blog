# Prefix Filtering

Prefix filters constrain NLRI by address and prefix length. Good external policy commonly rejects:

- Default unless explicitly expected.
- Martian, documentation, loopback, link-local, multicast, and other special-use space where inappropriate.
- Prefixes longer than the agreed maximum length.
- Customer advertisements outside registered authorization.
- Your own prefixes received from outside.

A prefix-list entry includes both the base prefix and allowed length range. Confusing “subnet of” with “exact match” is a common outage cause.

Maintain source-of-truth objects and generate filters where possible. When changing a filter, calculate the exact before/after route set and validate both IPv4 and IPv6.

---

