# UPDATE error handling and treat-as-withdraw

Classic BGP often reset a session for malformed UPDATEs, causing collateral withdrawal of every route from that peer. RFC 7606 defines more granular actions for many attribute errors, including **treat-as-withdraw** for affected NLRI and **attribute discard** where safe.

This improves robustness but can hide a persistent malformed-route problem behind a partial reachability loss. Monitor malformed-update counters, logs, and per-prefix disappearance even when the session remains Established.

---

