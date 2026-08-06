# eBGP Advertisement and AS Loops

When exporting a route to eBGP, a speaker normally:

- Applies export authorization.
- Prepends its ASN to AS_PATH.
- Changes NEXT_HOP to itself on a directly connected session.
- Sends only one selected path unless an extension such as ADD-PATH is negotiated.

The receiver rejects a route containing its own ASN, preventing the advertisement from circling back through the interdomain topology.

Features such as as-override, allowas-in, and remove-private-as deliberately change loop-related behavior for specific designs. They must be narrowly scoped because they weaken the assumptions behind standard AS-loop prevention.

---

