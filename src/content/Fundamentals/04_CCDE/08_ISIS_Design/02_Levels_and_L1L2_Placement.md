# Levels and L1/L2 placement

- **L1:** inside an area; default toward L1/L2 for “other.”
- **L2:** backbone between areas.
- **L1/L2:** the ABR analogue; must be placed so L2 is **contiguous**.

```text
POP L1-only  -- L1/L2 at POP edge -- L2 core -- L1/L2 -- POP L1
```

A common SP pattern: L1 in the POP, L2 in the core. Putting L1/L2 everywhere flattens the hierarchy (everyone is backbone). Breaking L2 contiguity partitions the backbone.

Suboptimal routing: L1 uses a default to nearest L1/L2, which may not be the best exit—same class of problem as OSPF summarization.

## Interview framing

“L1 hides POP detail; L2 is the backbone and must stay contiguous. L1/L2 routers are deliberate edges, not a default on every box.”

---
