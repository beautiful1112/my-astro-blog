# Redistributing into EIGRP

Routes injected into EIGRP from another source become **external** (`D EX`). Unlike OSPF, EIGRP does **not** invent a usable composite metric for redistributed prefixes unless you supply a **seed metric**. Without it, redistribution often yields metric 0 / infinity and the prefixes never leave the local router usefully.

## Seed metric components

EIGRP composite metric (classic, K1/K3 defaults) needs:

| Component | Role in seed |
|---|---|
| **Bandwidth** | kbps of the “worst” link metaphor; lower BW → larger metric |
| **Delay** | tens of microseconds; higher delay → larger metric |
| **Reliability** | 0–255 (255 = 100%) |
| **Load** | 1–255 |
| **MTU** | carried; not in default K-vector calculation |

Cisco `default-metric` / `metric` on redistribute sets these five values for all (or mapped) redistributed routes.

## Classic mode configuration

```text
router eigrp 100
 ! bandwidth delay reliability load MTU
 default-metric 100000 100 255 1 1500
 redistribute ospf 1 metric 100000 100 255 1 1500 route-map OSPF-TO-EIGRP
 redistribute static metric 100000 1000 255 1 1500 route-map STATIC-TO-EIGRP
```

Connected routes redistributed into EIGRP typically inherit interface metrics; still prefer an explicit route-map for tagging.

## Named mode

```text
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  topology base
   default-metric 100000 100 255 1 1500
   redistribute ospf 1 route-map OSPF-TO-EIGRP
```

Wide metrics: seed still matters; values feed the 64-bit formula. Keep seed consistent across redistribution points so dual boundary routers do not create unequal externals and needless queries.

## Route-map pattern (tag + seed)

```text
route-map OSPF-TO-EIGRP deny 10
 match tag 100
! deny anything already tagged as from EIGRP AS 100
route-map OSPF-TO-EIGRP permit 20
 match ip address prefix-list OSPF-OK
 set tag 110
 set metric 100000 100 255 1 1500
```

## Verification

```text
show ip eigrp topology 192.0.2.0/24
! External, Originating router / AS / tag / seed metric components
show ip route 192.0.2.0
! D EX [170/...]
show ip protocols
! Redistributing: ...
```

Confirm peers see the external; a local-only entry with infinite metric means seed was omitted or filtered.

## Risks

- Missing `default-metric` / `metric` → silent failure (classic “redistribute does nothing”).
- Different seed at two mutual-redistribution points → suboptimal paths and flaps.
- Redistributing entire OSPF domain without prefix-lists → query-domain explosion.

## Interview framing

“Into EIGRP you must set bandwidth, delay, reliability, load, and MTU as the seed; without it externals often never propagate. They install as D EX with AD 170.”

## Related

- [Administrative Distances](01_Administrative_Distances.md)
- [Route Tags](04_Route_Tags.md)
- [Redistribution Failures](../20_Troubleshooting/09_Redistribution_Failures.md)

---
