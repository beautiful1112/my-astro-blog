# Lab: RPKI Origin Validation

## Topology

Speaker with RTR to a validator cache; peer announces Valid, Invalid, and NotFound prefixes (lab ROAs).

## Objectives

- Observe validation state on each path.
- Apply policy: prefer Valid, reject Invalid, allow NotFound with lower LP.
- Break TE more-specific against maxLength=/24 ROA.

## Config touchpoints

```text
router bgp 65000
 bgp rpki server tcp 192.0.2.10 port 323
 address-family ipv4
  neighbor 203.0.113.1 route-map RPKI-IN in
route-map RPKI-IN deny 10
 match rpki invalid
route-map RPKI-IN permit 20
 match rpki valid
 set local-preference 200
route-map RPKI-IN permit 30
 match rpki not-found
 set local-preference 100
```

## Tasks

1. Show validation states before policy.
2. Reject Invalid; confirm absence from Loc-RIB.
3. Announce /25 under /24-only ROA; observe Invalid ([case](../24_Practical_Cases/09_ROA_MaxLength_Makes_TE_Prefix_Invalid.md)).

## Expected evidence

Invalid never installed under reject policy; Valid preferred over NotFound via LP.

---
