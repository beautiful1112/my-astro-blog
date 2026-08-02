# BGP session protection

Common mechanisms:

- TCP MD5 signatures (widely deployed, operationally simple, older cryptography/key handling);
- TCP Authentication Option, where supported;
- Generalized TTL Security Mechanism (GTSM), expecting received TTL near 255 so off-path attackers cannot easily spoof a directly connected peer;
- infrastructure ACLs and control-plane policing;
- management-plane protection and key rotation procedures.

Authentication protects the transport peer, not the truth of the routes it is authorized to advertise. Prefix and path policy remain mandatory.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
