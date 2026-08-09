# Route Accepted but Not Best

The path is eligible but loses BGP decision. Fix selection inputs; do not clear the session.

## Decision checklist (policy-first mental model)

1. Weight (Cisco) / preference quirks.
2. LOCAL_PREF (higher wins)—still beats shorter AS_PATH.
3. Local origination.
4. AS_PATH length (after remove-private / confederation handling).
5. ORIGIN.
6. **AIGP** when enabled ([AIGP](../08_Path_Attributes/11_AIGP.md)).
7. MED within comparison scope ([MED case](../24_Practical_Cases/05_MED_Not_Compared_Across_Upstreams.md)).
8. eBGP over iBGP; IGP cost to NEXT_HOP; RID / peer IP; ADD-PATH / multipath.

## RR path hiding

A route reflector advertises only its best path per prefix (unless ADD-PATH). Clients may never see the low-latency external path—see [RR path hiding](../25_Interview_Questions/10_Route_Reflector_Path_Hiding.md) and [case](../24_Practical_Cases/03_Route_Reflector_Hides_Low_Latency_Path.md).

## Evidence

```text
show bgp ipv4 unicast 203.0.113.0/24
! List all paths; note best reason and attribute deltas
```

Compare apples to apples: same prefix length (more-specifics win in forwarding regardless of attributes—[hijack case](../24_Practical_Cases/06_More_Specific_Hijack_Beats_Attributes.md)).
## Interview-ready summary

“Accepted means import policy passed; best means it won the decision process. Next I dump all paths, compare LP/AS_PATH/AIGP/MED scope, and check for RR path hiding or ADD-PATH gaps before touching sessions.”


---
