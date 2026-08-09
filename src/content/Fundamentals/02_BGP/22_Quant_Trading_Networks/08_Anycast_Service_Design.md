# Anycast for Trading-Support Services

Anycast can distribute **stateless** supporting services (DNS, telemetry collectors, selected APIs). It is a poor fit for stateful order sessions that cannot tolerate a site change mid-flow.

## Health withdrawal must mean readiness

Withdraw (or stop advertising) only when:

- Local application probe fails.
- Critical dependencies fail (auth, storage, feed).
- Drain window completed for graceful take-out.
- Remaining sites have capacity for the shift.

Interface up ≠ service ready. Aggregation can hide a /32 withdrawal if a covering aggregate remains.

## BGP touchpoints

```text
! Advertise anycast /32 only when track/SLA object is up
route-map ANYCAST-OUT permit 10
 match ip address prefix-list ANYCAST-DNS
 match track 10
 set community NO-EXPORT additive
```

Consider minimum advertisement interval and dampening so flapping health checks do not churn global tables.

## Verification / failure test

```text
show bgp ipv4 unicast <anycast>
# Pull site A advertisement; confirm traffic moves; watch site B CPU/bandwidth
```

When one site withdraws, traffic shifts per external policy and may overload the next-nearest region—test the full redistribution event. See [Anycast with BGP](../20_Advanced_Families/06_Anycast_with_BGP.md).

## Ops note

Record the intended LOCAL_PREF / community class for each VIP in the same repo as the configs so on-call does not reverse-engineer intent from live attributes alone.

---
