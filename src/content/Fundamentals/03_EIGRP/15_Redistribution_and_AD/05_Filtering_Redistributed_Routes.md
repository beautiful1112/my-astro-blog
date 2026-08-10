# Filtering redistributed routes

Redistribution without filters imports **policy debt**. Filters decide which prefixes cross protocol boundaries; tags decide which *direction* is allowed to return.

## Filter tools (Cisco)

| Tool | Typical use |
|---|---|
| Prefix-list | Exact/less-equal prefix sets |
| ACL | Legacy / host-based matches |
| Route-map | Combine match + set tag/metric |
| `distribute-list` | Filter within EIGRP (separate from redistribute) |
| `offset-list` | Metric nudge, not a substitute for deny |

## Prefix-list + route-map

```text
ip prefix-list OSPF-OK seq 10 permit 10.20.0.0/16 le 24
ip prefix-list OSPF-OK seq 20 deny 0.0.0.0/0 le 32
!
route-map OSPF-TO-EIGRP deny 10
 match tag 100
route-map OSPF-TO-EIGRP permit 20
 match ip address prefix-list OSPF-OK
 set tag 110
 set metric 100000 100 255 1 1500
route-map OSPF-TO-EIGRP deny 100
!
router eigrp 100
 redistribute ospf 1 route-map OSPF-TO-EIGRP
```

Always end with an explicit deny for clarity even when route-map implicit deny exists.

## Filtering inside EIGRP vs on redistribute

| Mechanism | Scope |
|---|---|
| `redistribute … route-map` | Only at the protocol boundary |
| `distribute-list` in/out | What EIGRP accepts/advertises on interfaces / ASN |
| Stub | Limits query/response role, not a prefix ACL |
| Summary | Hides specifics behind aggregate |

Do not use stub or summary as your only redistribution safety net.

## Filtering defaults and leaks

Deny `0.0.0.0/0` unless default injection is intentional ([Default Route Injection](07_Default_Route_Injection.md)). Deny RFC1918 leaks into BGP if EIGRP→BGP; deny provider aggregates into campus if OSPF→EIGRP.

## Verification

```text
show route-map OSPF-TO-EIGRP
show ip prefix-list OSPF-OK
show ip eigrp topology | include 10.20
! unexpected prefixes absent
debug ip routing
! carefully, during change window
```

After policy change, clear only what is needed (`clear ip route` / soft redistribution refresh behavior varies—prefer waiting for natural update or interface bounce in lab).

## Risks

- Permit-any “temporary” route-map left in production.
- Filtering on one border router only → inconsistent topology and SIA risk.
- Confusing `distribute-list` direction (in vs out).

## Interview framing

“Redistribution filters define the allow-list of prefixes; tags define anti-loop. Both are mandatory on mutual boundaries.”

## Related

- [Route Tags](04_Route_Tags.md)
- [Mutual Redistribution Loops](06_Mutual_Redistribution_Loops.md)
- [Redistribution Failures](../20_Troubleshooting/09_Redistribution_Failures.md)

---
