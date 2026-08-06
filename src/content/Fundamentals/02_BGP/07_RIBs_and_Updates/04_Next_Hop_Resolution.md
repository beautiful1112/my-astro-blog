# Next-hop resolution

A BGP path is usable only if its next hop is resolvable in the local routing table. iBGP often preserves an external next hop, so all internal speakers need IGP/static reachability or an edge router must use `next-hop-self`.

Resolution may be recursive through an IGP route, tunnel, MPLS transport, or another BGP route. Excessive or cyclic recursion prevents installation. A session and prefix can both look valid while the path is marked inaccessible.

---

