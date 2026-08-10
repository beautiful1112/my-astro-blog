# Lab: Redistribution with Tags

## Objective

Mutually redistribute EIGRP ↔ OSPF at two border routers and use **route tags** so prefixes do not bounce forever between domains; contrast loop/suboptimal behavior before and after tagging.

## Prerequisites / skills practiced

- Seed metrics into EIGRP (`default-metric` or route-map `set metric`)
- External EIGRP AD **170** vs internal **90**
- Tag on redistribute + deny tagged on reverse
- Why AD alone fails with two mutual borders

## Topology and addressing

```text
EIGRP AS 100 domain              OSPF 1 domain
R1 ---- B1 ==================== B2 ---- R4
         \\                    //
          \==== optional B3 ===/   (minimum lab: B1 and B2 only)

EIGRP link B1–R1: 192.0.2.0/24     (.1=B1, .10=R1)
OSPF link  B2–R4: 198.51.100.0/24  (.2=B2, .40=R4)
Border link B1–B2: 10.0.12.0/24    (.1=B1, .2=B2)  — run OSPF or both as needed per design
R1 Lo0: 10.1.1.1/32 (EIGRP origin)
R4 Lo0: 10.4.4.4/32 (OSPF origin)
B1 Lo0: 203.0.113.1/32
B2 Lo0: 203.0.113.2/32
```

Minimum viable: B1 and B2 both redistribute both ways; R1 EIGRP-only; R4 OSPF-only.

## Configuration steps

1. Bring up EIGRP on R1–B1 (and B2 if in EIGRP); OSPF on R4–B2 (and B1 if in OSPF). Distinct origins: `10.1.1.1/32` and `10.4.4.4/32`.
2. On B1 and B2, redistribute **without** tags first (lab only) and observe `10.4.4.4` in EIGRP as external and `10.1.1.1` in OSPF—watch for loops or suboptimal paths with two borders.
3. Apply tagging policy (example classic on B1; mirror on B2 with direction-appropriate maps):

```text
route-map OSPF-TO-EIGRP permit 10
 set tag 100
 set metric 100000 100 255 1 1500
route-map EIGRP-TO-OSPF deny 10
 match tag 100
route-map EIGRP-TO-OSPF permit 20

router eigrp 100
 default-metric 100000 100 255 1 1500
 redistribute ospf 1 route-map OSPF-TO-EIGRP

router ospf 1
 redistribute eigrp 100 subnets route-map EIGRP-TO-OSPF
```

Mirror: tag **200** when EIGRP→OSPF and deny tag 200 when OSPF→EIGRP (or use one tag scheme consistently documented).

4. Clear routes if needed; verify each origin appears once per domain without re-entry.
5. Traceroute from R1 to R4 and reverse; confirm stable next hops.

## Expected show-output checkpoints

```text
show ip route 10.4.4.4
show ip route 10.1.1.1
show ip eigrp topology 10.4.4.4/32
show ip ospf database
show route-map
```

Look for: `D EX` with AD **170** for OSPF-originated prefixes; route-map hit counts; no oscillating next hops after tags; missing seed metric → redistribute into EIGRP fails.

## Failure injection

| Injection | Expected symptom |
|-----------|------------------|
| Remove deny-tagged clause on one border | Loop or suboptimal oscillation |
| Forget `default-metric` / set metric into EIGRP | Redistributed prefixes missing in EIGRP |
| Rely on AD only with two borders | External still re-enters via the other protocol path |
| Same tag both directions incorrectly | Over-blocking legitimate prefixes |

## Verification checklist

- [ ] Before/after tag: route tables saved
- [ ] External AD 170 confirmed on EIGRP side
- [ ] Traceroute stable both directions
- [ ] Route-map hit counts increment on redistribute
- [ ] Documented seed metric values

## Write-up / interview reflection

1. What loop or suboptimal symptom appeared before tags?
2. Why did AD alone fail with two borders?
3. Which seed metric into EIGRP did you choose and why?
4. How do you prove a prefix is EIGRP-external in `show` output?

## Related

- [Administrative distances](../15_Redistribution_and_AD/01_Administrative_Distances.md)
- [Redistributing into EIGRP](../15_Redistribution_and_AD/02_Redistributing_into_EIGRP.md)
- [Route tags](../15_Redistribution_and_AD/04_Route_Tags.md)
- [Mutual redistribution loops](../15_Redistribution_and_AD/06_Mutual_Redistribution_Loops.md)
- [Case: mutual redistribution loop](../21_Practical_Cases/09_Mutual_Redistribution_Loop.md)

---
