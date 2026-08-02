# KEEPALIVE and NOTIFICATION messages

KEEPALIVE contains only the common header and refreshes liveness without routing changes. Any valid UPDATE also refreshes the Hold Timer.

NOTIFICATION contains error code, subcode, and optional diagnostic data. Once sent or received, the session normally closes. Logs on both ends may differ: one reports the protocol error, while the other records only a remote close. Correlate timestamps and packets.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
