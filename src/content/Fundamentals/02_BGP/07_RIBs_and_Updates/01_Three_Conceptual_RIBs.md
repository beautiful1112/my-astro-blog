# Adj-RIB-In, Loc-RIB, and Adj-RIB-Out

- **Adj-RIB-In:** routes learned from each peer before the local decision process; platforms may store pre-policy, post-policy, or both views.
- **Loc-RIB:** locally selected routes after policy and best-path processing.
- **Adj-RIB-Out:** routes selected and transformed for advertisement to a specific peer.

These are conceptual. An implementation need not store three literal copies. CLI wording such as “received-routes,” “routes,” and “advertised-routes” must be mapped to the platform's storage model.

---

