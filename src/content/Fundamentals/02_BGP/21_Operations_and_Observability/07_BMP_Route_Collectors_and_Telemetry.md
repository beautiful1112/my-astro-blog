# BMP, Route Collectors, and Telemetry

Three observation models serve different purposes:

- **BMP:** exports per-peer route and event views from a router.
- **BGP route collector:** forms sessions and records what peers advertise to it.
- **Streaming telemetry/logs:** exposes counters, state, CPU, queues, and FIB events.

Combine them to reconstruct route history. A collector may see only routes intentionally sent to it; BMP can expose pre-policy paths; telemetry can show why a valid route missed hardware installation.

Preserve accurate clocks and identifiers for router, peer, VRF, AFI/SAFI, RD, and path. Without that context, route histories become ambiguous.

---

