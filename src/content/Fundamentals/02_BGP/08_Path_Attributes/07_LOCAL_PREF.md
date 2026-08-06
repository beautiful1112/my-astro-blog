# LOCAL_PREF

LOCAL_PREF expresses the preferred exit from an AS. Higher is normally better.

It is a well-known discretionary attribute propagated throughout iBGP but not normally sent to external peers. Operators set it on import based on business relationship, prefix, community, region, security state, or performance policy.

A common commercial policy is:

1. Customer-learned routes: highest LOCAL_PREF.
2. Peer-learned routes: middle.
3. Provider-learned routes: lowest.

Because LOCAL_PREF is usually evaluated before AS_PATH length, a longer customer path can defeat a shorter provider path by design.

## Trading-network lesson

If the lowest-latency circuit should be primary, encode that intent explicitly and verify failure behavior. Do not rely on a short AS path as a latency proxy; business policy commonly dominates it.

---

