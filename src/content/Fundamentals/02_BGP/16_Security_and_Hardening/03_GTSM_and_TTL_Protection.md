# GTSM and TTL Protection

The Generalized TTL Security Mechanism (RFC 5082) protects directly connected or known-hop peers by sending packets with TTL 255 and accepting only packets whose received TTL is within the expected hop distance.

An off-path attacker far away cannot normally create a packet that arrives with a sufficiently high TTL.

GTSM complements, rather than replaces, session authentication and infrastructure ACLs. Multihop sessions require a correct hop allowance, and asymmetric routing must be understood.

A TTL-security mismatch produces a session that cannot establish even when addresses, ASN, and port 179 appear correct.

---

