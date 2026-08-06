# BGP Link-State

BGP-LS exports link-state and traffic-engineering topology information from IGP domains to consumers such as controllers and path-computation elements.

It carries nodes, links, prefixes, metrics, and extensions as BGP NLRI and attributes. It does not normally install those objects as ordinary destination routes.

Security and scale matter because topology data is sensitive and may be large. Use dedicated policy, sessions, and consumers; do not leak BGP-LS to ordinary Internet peers.

RFC 9552 is the current base BGP-LS specification and obsoletes RFC 7752.

---

