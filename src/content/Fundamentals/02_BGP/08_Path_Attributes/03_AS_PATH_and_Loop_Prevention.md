# AS_PATH and Loop Prevention

AS_PATH records autonomous systems through which an advertisement has passed. An eBGP speaker normally prepends its own ASN before exporting a route.

Two important segment types are:

- **AS_SEQUENCE:** ordered ASNs; each ASN counts toward path length.
- **AS_SET:** unordered ASNs created by some aggregation procedures; the entire set traditionally counts as one for selection and weakens precise path validation.

On eBGP import, a router normally rejects a route if its own ASN appears in AS_PATH. This is the fundamental inter-AS loop-prevention mechanism. iBGP does not prepend the local ASN, so iBGP requires separate advertisement rules.

AS_PATH is evidence of the advertised control-plane path, not a guarantee of the exact forwarding path, latency, business relationship, or legitimacy of every ASN.

## Troubleshooting

If a legitimate route is rejected for “own AS in path,” investigate accidental transit, route leaks, confederation behavior, or deliberate allowas-in/loops settings before relaxing loop protection.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
