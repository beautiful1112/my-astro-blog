# ConnectRetry and session retry behavior

ConnectRetry controls renewed transport attempts. Repeated Active/Connect oscillation indicates reachability, TCP, authentication, source-address, or collision problems—not missing prefixes.

Implementations may apply exponential backoff, idle-hold, or peer dampening after rapid failures. These protections prevent a broken neighbor from consuming control-plane resources but can delay recovery after the underlying fault is fixed. Inspect the current retry timer rather than assuming an immediate reconnect.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
