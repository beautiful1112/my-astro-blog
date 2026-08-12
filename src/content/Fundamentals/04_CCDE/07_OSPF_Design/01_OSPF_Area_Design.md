# OSPF area design

OSPF areas exist to **bound LSDB and SPF**, not to match the org chart. Area 0 is the transit backbone for inter-area routes.

## Rules that actually matter

- Every area should touch the backbone (or use a **virtual link** only as a temporary shame).
- Size by **LSA count, churn, and operational blast radius**, not a magic “50 routers.”
- Too many tiny areas: ABR complexity and messy summaries. One giant area: SPF and failure domain.

```text
Area 10 (campus A) -- ABR -- Area 0 -- ABR -- Area 20 (campus B)
                         |
                       Area 30 WAN
```

## Single vs multi-area

| Single area | Multi-area |
|---|---|
| Simple, fine for small/stable | Scale, fault isolation, summary |
| Any link change can SPF all | Inter-area is distance-vector-ish (type-3) |
| Easy addressing mistakes hidden | Needs a summarizable plan |

Start single if the network is small and addresses are messy; do not pretend areas will save a bad IP plan.

## Interview framing

“Areas are LSDB/SPF and summary boundaries. I add them when the domain is too noisy or too large—not one area per department.”

---
