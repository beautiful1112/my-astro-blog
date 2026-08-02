# Advertisement, withdrawal, and replacement

A peer can remove reachability by explicitly withdrawing NLRI, advertising replacement attributes for the same NLRI, or closing the session—which implicitly removes all routes learned from it unless restart retention applies.

BGP sends incremental changes, not periodic full-table refreshes. A route that remains unchanged can stay installed indefinitely with no repeated UPDATE.

When diagnosing a disappearance, distinguish explicit withdrawal, implicit replacement, session reset, policy reevaluation, and next-hop invalidation.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
