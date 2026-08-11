# EIGRP stub overview

**EIGRP stub** marks a router as a leaf for routing information and query processing. Neighbors learn the peer is stub via EIGRP hello/capability signaling and adjust advertisement and Query behavior accordingly.

## What stub changes

1. **Advertised routes**: only the selected categories (connected, summary, static, redistributed—per options); by default not arbitrary learned EIGRP transit routes.
2. **Query behavior**: stub router does not propagate Queries as a transit diffusion point; hubs avoid treating it as a path to remote enterprise prefixes.
3. **Topology role**: spoke/access edge—not a multi-site transit core node.

```text
* Hub non-stub
Hub <--> Core["Core"]
Spoke --does not transit / remote prefixes--> Hub
```

## When to use

- Classic DMVPN / hub-spoke WAN spokes.
- Access layer switches/routers that should not be queried for remote destinations.
- Any leaf where learning a default or summary from hub is enough.

## When not to use

- Distribution/core routers that must transit between regions.
- Dual-homed routers that must advertise learned paths between two hubs **as transit** (rare WAN designs—usually still stub with careful redistribution of connected/summary only).

## Quick config

```text
router eigrp 100
 eigrp stub connected summary
```

```text
show ip eigrp neighbors detail
```

## Stub vs filter vs summarize

| Tool | Primary job |
|---|---|
| Stub | Leaf role + query bound + advertise-class limit |
| Distribute-list | Prefix allow/deny |
| Summary | Hide specifics + query bound at hierarchy |

Use stub for **role**, not as the only prefix filter when you need surgical denies.

## Risks

- Stubbing a transit distribution node → lost alternate paths / unexpected Active.
- Hub expecting spoke to advertise learned routes from a second hub—blocked by stub design (usually desirable).

## Interview framing

“Stub = non-transit leaf for queries and for which route types are advertised. First knob on every spoke in hub-and-spoke EIGRP.”

## Related

- [Stub options](02_Stub_Options.md)
- [Stub as query boundary](../09_Query_Scope_and_Convergence/03_Stub_as_Query_Boundary.md)
- [Stub in hub and spoke](03_Stub_in_Hub_and_Spoke.md)

---
