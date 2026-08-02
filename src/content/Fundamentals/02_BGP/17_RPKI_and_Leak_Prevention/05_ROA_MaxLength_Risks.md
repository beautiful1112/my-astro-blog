# ROA maxLength Risks

A ROA authorizes an origin ASN for a prefix and optionally more-specific routes through **maxLength**.

Risks:

- Too short a maxLength makes legitimate traffic-engineering specifics Invalid.
- Too permissive a maxLength authorizes hijacked more-specifics from the same origin ASN.
- Publishing a replacement ROA in the wrong order can temporarily invalidate active announcements.

Prefer the least permissive authorization matching actual advertisements. Inventory planned failover and DDoS prefixes before enforcement, and stage ROA changes so old and new routing remain valid during transition.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
