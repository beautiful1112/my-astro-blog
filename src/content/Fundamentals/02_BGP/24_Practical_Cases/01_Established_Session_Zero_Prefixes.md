# Case: Established Session, Zero Prefixes

## Scenario

An eBGP peer has been Established for hours. Accepted and advertised prefix counts are both zero. On-call assumes “BGP is fine.”

## Expected evidence

```text
show bgp ipv4 unicast neighbors 192.0.2.1
! State: Established; Prefixes: 0/0/0
show bgp ipv4 unicast neighbors 192.0.2.1 advertised-routes
! empty
show bgp ipv4 unicast <local-prefix>
! local prefix exists in Loc-RIB
```

OPEN shows IPv4 unicast negotiated. Local table has the intended prefix; outbound policy has no permit term (default-reject / RFC 8212 posture).

## Config touchpoints

```text
route-map TO-PEER permit 10
 match ip address prefix-list ORIGINATE-OK
route-map TO-PEER deny 100
neighbor 192.0.2.1 route-map TO-PEER out
neighbor 192.0.2.1 route-map FROM-PEER in
```

## Verification

After adding exact permit and soft-out refresh: advertised-routes shows the prefix; peer’s received/accepted increments. Do **not** solve with permit-any.

## Lesson

Session state ≠ route exchange. See [Established but No Routes](../23_Troubleshooting/03_Established_but_No_Routes.md).
## Cross-links

Use the matching troubleshooting or interview note if this case appears in an incident; keep evidence (show output + probe) with the ticket.

---
