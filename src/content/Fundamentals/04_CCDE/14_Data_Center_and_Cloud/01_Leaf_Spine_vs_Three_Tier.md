# Leaf-spine versus three-tier

Classic DC: access-aggregation-core, oversubscribed north-south. Modern apps are **east-west**. Leaf-spine (CLOS) gives predictable bandwidth and ECMP.

```text
Spine  S1  S2  S3
       | \/ \/ |
Leaf  L1 L2 L3 L4   -- servers / border
```

Oversubscription is a **stated ratio**, not an accident. AI/HPC may need nonblocking or a second fabric (storage/compute).

Three-tier still appears in brownfield and small DCs. Do not force a 4-spine CLOS on a 6-rack room without a requirement.

## Interview framing

“Leaf-spine is for east-west scale with ECMP. I keep three-tier only when north-south and size make it the cheaper, operable module.”

---
