# Why BGP exists

An IGP optimizes reachability inside one administration. The Internet needs a protocol that can:

- scale to global prefix and policy volume;
- enforce administrative/business relationships;
- prevent AS-level loops;
- aggregate CIDR prefixes;
- support multiple address families and services;
- expose controlled information without revealing all internal topology.

BGP therefore prioritizes policy, stability, and incremental exchange. It intentionally does not flood a complete link-state topology or calculate a globally shortest path.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
