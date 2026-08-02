# Route-Reflector Path Hiding

An RR normally advertises only its selected best path. A client may therefore never learn an alternative that would be best from the client's IGP location.

Consequences:

- Suboptimal exit selection.
- Loss of ECMP.
- Slower failover if the hidden alternative was not preinstalled.
- A low-latency path invisible to a trading host's edge router.

Mitigations include ADD-PATH, diverse reflector placement, multiple sessions, and topology-aware/optimal route reflection. Each adds state or design complexity.

When troubleshooting, inspect all paths on the RR—not only what the client received.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
