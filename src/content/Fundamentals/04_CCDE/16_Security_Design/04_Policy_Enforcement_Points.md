# Policy enforcement points

Intent without an enforcement point is a slide. Name **where** it is enforced: access switch, WLC, FW, SD-WAN, ZTNA broker, cloud SG, SASE.

Too many PEPs with no source of truth → gaps and duplicates. Too few (only a giant core FW) → hairpin and bypass via local DIA.

```text
Identity (IdP/ISE) -- policy store
        |               |
   Edge PEP         WAN/cloud PEP
```

pxGrid/SXP/RADIUS are **signaling**, not enforcement. The switch or FW still has to drop.

## Interview framing

“I list enforcement points and one source of truth. Signaling protocols do not drop packets; PEPs do.”

---
