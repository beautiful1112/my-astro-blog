# ABR and ASBR placement

**ABR** sits on area 0 plus at least one other area and is the **summary and type-3** control point. **ASBR** injects external (type-5/7) state.

## Placement

- Put ABRs where you **intend to summarize** (campus/WAN/DC edge), in pairs for HA.
- Too many ABRs in one area: more type-3s and more ways to be inconsistent.
- ASBRs belong at a **deliberate seam** (Internet, BGP, redistribution)—not on every dist switch.

```text
Bad:  every dist is ASBR redistributing BGP
Good: two DC borders are ASBRs; campuses take a default or a few aggregates
```

Internet edge as OSPF ASBR advertising thousands of BGP prefixes into the IGP is a classic failure. Keep BGP at the edge; inject a default or limited aggregates.

## Interview framing

“ABRs are where I hide topology. ASBRs are rare seams. I do not sprinkle either role on every box.”

---
