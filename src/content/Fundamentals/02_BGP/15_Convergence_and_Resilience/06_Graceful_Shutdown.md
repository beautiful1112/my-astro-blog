# Graceful BGP Shutdown

RFC 8326 defines a well-known **GRACEFUL_SHUTDOWN** community. Before planned maintenance, a router advertises affected routes with this signal so neighbors can lower preference and move traffic away before the session is closed.

Safe sequence:

1. Mark routes with the shutdown community.
2. Confirm neighbors selected alternatives.
3. Verify traffic drained.
4. Disable the session or link.

Both parties need policy that recognizes the community. Without it, the tag alone changes nothing.

Graceful shutdown addresses planned maintenance. It does not improve unplanned failure detection.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
