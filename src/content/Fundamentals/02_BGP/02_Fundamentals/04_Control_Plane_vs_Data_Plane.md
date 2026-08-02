# BGP control plane versus data plane

BGP learning a route does not guarantee forwarding:

```text
Peer UPDATE -> Adj-RIB-In -> import policy -> eligible paths
            -> best-path decision -> Loc-RIB
            -> routing-table competition/recursion -> FIB
            -> export policy -> peer-specific Adj-RIB-Out
```

A BGP route can be valid and best within BGP yet fail installation because its next hop is unresolved, a more-preferred protocol owns the prefix, hardware programming fails, or policy creates a discard next hop.

Troubleshooting must identify the exact stage at which the route stopped progressing.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
