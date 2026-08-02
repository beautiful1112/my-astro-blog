# Four-Octet ASN Path Handling

RFC 6793 extends ASNs from two octets to four. A capable speaker uses four-octet values directly. When a new speaker advertises to a legacy two-octet speaker, it can substitute **AS_TRANS (23456)** in AS_PATH and carry the real information in **AS4_PATH**.

When information returns to a capable domain, the receiver reconstructs the effective path using AS_PATH and AS4_PATH rules. **AS4_AGGREGATOR** performs a similar compatibility role for AGGREGATOR.

Operational implications:

- Seeing 23456 may indicate a legacy compatibility boundary, not the neighbor's real ASN.
- Poor filters that assume all ASNs fit in 16 bits can reject valid routes.
- Use plain or dotted notation consistently; a value such as 65551 may also be written 1.15.

Modern designs should support four-octet ASNs end to end; compatibility attributes exist for transition, not as a preferred steady-state representation.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
