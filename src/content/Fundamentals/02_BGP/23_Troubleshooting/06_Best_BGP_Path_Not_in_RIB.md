# Best BGP Path Not Installed in the RIB

Possible causes:

- Another protocol has a lower administrative distance/preference.
- The BGP next hop is unresolved.
- RIB failure due to resource or recursive-loop conditions.
- The route belongs to another VRF/table.
- Label or tunnel resolution is absent for a service route.
- The route is marked stale, hidden, or inactive by platform rules.

Inspect the main route table's reason and competing sources. “Best in BGP” means best among BGP candidates, not guaranteed winner among all routing protocols.

---

