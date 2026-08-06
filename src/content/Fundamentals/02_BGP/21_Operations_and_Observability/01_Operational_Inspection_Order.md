# Operational Inspection Order

Use the same sequence for every BGP incident:

1. Identify exact prefix, AFI/SAFI, VRF, and router.
2. Check peer state, uptime, last reset, negotiated capabilities, and prefix counters.
3. Check whether the route was received pre-policy.
4. Check whether import policy accepted it.
5. Inspect all eligible paths and the best-path reason.
6. Confirm next-hop recursion and main-RIB/FIB installation.
7. Check outbound policy and per-neighbor advertisement.
8. Test the forwarding path and return path.

This avoids the unproductive conclusion “BGP is up, so routing is fine.”

---

