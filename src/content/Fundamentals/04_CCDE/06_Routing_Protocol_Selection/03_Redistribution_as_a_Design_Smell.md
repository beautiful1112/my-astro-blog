# Redistribution as a design smell

Redistribution is a **seam**, not a topology. Mutual redistribution without tags/filters is how you buy loops and suboptimal paths.

## When it is justified

- Migration (OSPF → IS-IS) for a defined period
- Merger of two ASes/IGPs with a date to collapse
- PE-CE where the CE IGP is a customer constraint
- Injecting a limited set of statics/connected

## When it is a smell

- Two IGPs forever because “that is how it grew”
- Redistributing BGP into IGP (prefix explosion, instability)
- Mutual redistribute at two routers with no tags → loops

```text
OSPF domain --(tag/filter)--> BGP --(tag/filter)--> IS-IS
                 prefer one border as primary
```

Prefer **BGP as the glue** between domains. IGP should stay an underlay, not a dumping ground.

## Interview framing

“Redistribution is a temporary or narrow seam with tags and a single policy story. If I need two IGPs forever, I should ask whether BGP should sit between them.”

---
