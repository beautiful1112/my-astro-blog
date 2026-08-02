# ARP and ND Suppression

EVPN type 2 routes can carry MAC-to-IP bindings. A PE or VTEP can answer local ARP or Neighbor Discovery requests from this control-plane database instead of flooding them across the overlay.

Benefits:

- Less broadcast/multicast replication.
- Faster neighbor resolution.
- Better scaling in large fabrics.

Risk: a stale or malicious binding can misdirect traffic. Validate binding origin, mobility sequence, aging, duplicate detection, and interaction with security features.

Suppression reduces flooding; it does not eliminate the need for correct endpoint learning and reachability.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
