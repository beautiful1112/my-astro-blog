# AS-Path Filtering

AS-path policy can enforce properties such as:

- A customer path begins with the customer's ASN.
- An eBGP path begins with the neighbor's ASN.
- Private or reserved ASNs do not escape.
- A prohibited ASN is absent.
- Path length stays within an expected bound.

Regex syntax and AS_SET/confederation representation vary by platform. Test expressions against explicit positive and negative examples; anchors are especially easy to misuse.

AS-path filtering is not cryptographic validation. A peer can construct a syntactically plausible path. Combine it with prefix authorization, RPKI origin validation, business-role policy, and monitoring.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
