# BGP common message header

Every BGP message begins with:

- 16-octet Marker;
- 2-octet Length;
- 1-octet Type.

Classic maximum length is 4096 octets. Extended Message capability allows messages up to 65,535 octets, except OPEN remains constrained. Message types include OPEN (1), UPDATE (2), NOTIFICATION (3), KEEPALIVE (4), and ROUTE-REFRESH (5).

A corrupt length or type is a header error and normally terminates the session.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
