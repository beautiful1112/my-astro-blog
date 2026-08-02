# Route Not Advertised to a Peer

Check:

1. Is the route eligible and selected for advertisement?
2. Does iBGP split horizon prevent propagation?
3. Does route-reflector client/non-client logic allow it?
4. Does export policy permit the prefix and attributes?
5. Is the family active for the peer?
6. Would AS-loop detection or community scope suppress it?
7. Is outbound route filtering present?
8. Has update generation completed?

Inspect the per-neighbor advertised-route view, not only the local BGP table.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
