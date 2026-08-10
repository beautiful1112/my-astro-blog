# Stub and Summary Memory Card

## Stub

| Option | Advertises (typical) | Notes |
|---|---|---|
| connected | Connected | Default component |
| summary | Summaries | Default component |
| static | Statics redistributed/advertised per rules | Optional |
| redistributed | Redistributed | Optional |
| receive-only | Nothing | Still learns |

- Hub **skips querying** stub peers for routes.
- Stub ≠ “no transit forwarding” and ≠ “receives no routes.”
- Hub-spoke WAN: **stub on spokes** almost always.

## Summary

- Prefer **explicit interface summary** + **Null0** (AD 5).
- **no auto-summary** in modern designs.
- Summary shrinks RIB **and** helps **bound queries**.
- Leak-maps for selected specifics through a summary.

## Query domain design triad

1. **Stub** at edge  
2. **Summary** at aggregation  
3. **Hierarchy** in addressing  

SIA symptom → check this triad before random debug.

---
