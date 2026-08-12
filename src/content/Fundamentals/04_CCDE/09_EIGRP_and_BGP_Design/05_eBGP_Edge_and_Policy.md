# eBGP edge and policy

At the Internet or inter-AS edge, BGP **is** the product: what you accept, what you advertise, how you prefer.

## Design checklist

- Dual ISP: independent circuits, independent peering, not two NICs on one CPE only
- Prefix filters, max-prefix, RPKI/ROA where relevant
- Outbound TE: local-pref, MED, AS-path, communities—pick a **story**
- Do not become accidental transit
- Next-hop and IGP for the edge loopbacks must survive a single link cut

```text
ISP-A -- CE/PE-A \ 
                   Enterprise core (never full table in IGP)
ISP-B -- CE/PE-B /
```

Default-only vs partial vs full table is an **RTO and TE** choice, not a macho metric.

## Interview framing

“Edge BGP is filter, max-prefix, no accidental transit, and dual providers that do not share fate. The IGP gets a default or aggregates—not the Internet.”

---
