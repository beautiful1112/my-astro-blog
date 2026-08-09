# Market-Data vs Order-Path Policy

Market data and order entry often share a site but must not share accidental best paths.

## Contrasting requirements

| Concern | Market data | Order path |
|---|---|---|
| Fan-out | High; redundant feeds | Narrow VIP set |
| Loss tolerance | Gap detection / recovery | Very low; deterministic |
| Path stability | Prefer stable feeds | Prefer stable + lowest latency class |
| Prefix set | Provider/exchange feeds | Strict destination allowlists |
| State | Often multicast + gap fill | Stateful sessions / risk checks |

## Policy separation

Use separate VRFs, Route Targets, communities, queues, and monitoring where appropriate. Tag routes so a bulk Internet or recovery-feed path cannot become preferred for order VIP prefixes.

```text
route-map MD-IN permit 10
 match community MD-FEED
 set local-preference 180
 set community MD-CLASS additive
route-map ORDER-IN permit 10
 match ip address prefix-list ORDER-VIPS
 set local-preference 300
 set community ORDER-CLASS additive
```

Export policy must ensure ORDER-CLASS prefixes never leak to general Internet peers.

## Verification

```text
show bgp ipv4 unicast community ORDER-CLASS
show bgp ipv4 unicast neighbors <internet-peer> advertised-routes | include <order-vip>
! must be empty
```

Do not let a high-capacity MD circuit’s IGP metric accidentally steal order traffic without an explicit LP design.

---
