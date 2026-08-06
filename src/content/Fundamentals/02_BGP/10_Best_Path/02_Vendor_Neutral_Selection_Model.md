# Vendor-Neutral Best-Path Model

RFC 4271 specifies a decision process, but production platforms add local attributes and deterministic tie-breakers. A safe conceptual sequence is:

1. Prefer administratively favored routes, such as vendor weight or policy class.
2. Prefer higher LOCAL_PREF.
3. Consider locally originated status where implemented.
4. Prefer shorter AS_PATH.
5. Prefer better ORIGIN.
6. Prefer lower MED under the configured comparison scope.
7. Often prefer eBGP over iBGP.
8. Prefer lower IGP metric to the BGP next hop.
9. Apply age, router-ID, cluster-list, and neighbor-address tie-breakers.

The exact order and knobs are implementation-specific. Multipath relaxes selected comparisons without eliminating the need for a single control-plane best path on many systems.

In interviews, state the common sequence, then explicitly say you would verify the platform's documented algorithm.

---

