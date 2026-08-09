# External Connectivity Design

Classify every external BGP session and refuse a single “external peer” template.

## Session classes

| Class | Typical policy notes |
|---|---|
| Transit provider | Full/partial table; max-prefix; RPKI; valley-free export |
| IXP route server | Next-hop unchanged often required; RS is not the data path |
| Bilateral peer | Tight prefix lists; relationship communities |
| Exchange / broker private | Small known sets; often strict LP; low churn expected |
| DDoS scrubbing | Diversion communities; pre-authorized RTBH/FlowSpec |
| Cloud on-ramp | Region prefixes; avoid accidental default |

## Per-session documentation

For each peer record: authorized prefixes and expected count, first-AS expectations, next-hop behavior (`next-hop-self` vs [next-hop-unchanged](../12_eBGP_and_iBGP/09_Next_Hop_Unchanged.md)), LOCAL_PREF, communities in/out, maximum prefix, RPKI action, failover target, and physical failure domain (fiber entry, MMR, carrier).

## Config touchpoints

```text
neighbor 192.0.2.1 remote-as 64496
neighbor 192.0.2.1 description IX-RS-A
address-family ipv4
 neighbor 192.0.2.1 activate
 neighbor 192.0.2.1 route-map IX-RS-IN in
 neighbor 192.0.2.1 route-map NO-TRANSIT-OUT out
 neighbor 192.0.2.1 maximum-prefix 5000 90 restart 15
 neighbor 192.0.2.1 next-hop-unchanged
```

## Verification

```text
show bgp ipv4 unicast summary
show bgp ipv4 unicast neighbors 192.0.2.1 routes
show bgp ipv4 unicast neighbors 192.0.2.1 advertised-routes
```

Confirm prefix counts within band and that VIP order prefixes never appear in Internet-facing advertisements.

---
