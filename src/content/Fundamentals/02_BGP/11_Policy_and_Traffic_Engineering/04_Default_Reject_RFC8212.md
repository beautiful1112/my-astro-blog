# Default-Reject eBGP Policy

RFC 8212 requires an eBGP speaker using the Internet profile not to import or export routes until an explicit policy permits them.

This protects against a dangerous failure mode: a newly configured session immediately exchanging a full table or unintended transit routes before filters are attached.

Operational pattern:

1. Create prefix, AS-path, community, and validation policy.
2. Attach explicit import and export policy.
3. Configure conservative maximum-prefix limits.
4. Bring up the neighbor.
5. Verify accepted and advertised routes against intent.

Vendor defaults and legacy behavior differ, so treat default reject as a design requirement, not an assumption.

---

