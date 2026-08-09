# Route Not Advertised to a Peer

The prefix is local/best, but Adj-RIB-Out toward a neighbor is empty for that NLRI.

## Causes

| Cause | Notes |
|---|---|
| Outbound policy deny / default-reject | Most common |
| iBGP split horizon | Do not advertise iBGP-learned to iBGP peer without RR/confederation |
| RR cluster / client rules | Reflection topology |
| SoO match | PE suppresses site’s own routes toward CE ([SoO](../18_MPLS_L3VPN/07_Site_of_Origin.md)) |
| Conditional advertisement | Advertise-map not satisfied ([conditional](../11_Policy_and_Traffic_Engineering/10_Conditional_Advertisement.md)) |
| ORF | Peer requested a filter excluding the prefix ([ORF](../11_Policy_and_Traffic_Engineering/09_ORF.md)) |
| `next-hop-unchanged` / NH invalid remotely | Peer may discard after receipt—still “advertised” locally |
| Wrong AFI / VRF neighbor context | Operator looking at wrong session |

## Evidence

```text
show bgp ipv4 unicast neighbors 192.0.2.1 advertised-routes
show route advertising-protocol bgp 192.0.2.1   ! Junos
```

If locally advertised but remote has nothing, shift to remote import / max-prefix / RPKI—not local export.

For PE→CE, presence of SoO on a candidate that matches the CE attachment is a successful loop-prevention feature, not a bug—confirm intentional design.
## PE-CE checklist

1. Is the neighbor under the correct VRF AF?
2. Does SoO on the candidate match the CE attachment?
3. Is conditional advertisement waiting on a non-existent trigger prefix?
4. After fix, soft-out and re-check advertised-routes.


---
