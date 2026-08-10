# Interview: Redistribution and AD

## Q1 — Cisco AD defaults

**Q:** EIGRP administrative distances (Cisco)?

**Model answer:** **Internal 90**, **external 170**, **summary 5**. Summary AD 5 is why Null0 summaries punch through most IGPs—critical for loop prevention, dangerous if summarizer lacks components.

**Common wrong answer:** “EIGRP is always AD 90.”

## Q2 — Seed metric

**Q:** Why must you set a default metric when redistributing into EIGRP?

**Model answer:** Redistributed routes need a **seed metric** (bandwidth, delay, reliability, load, MTU). Without it, Cisco IOS often **does not advertise** the redistributed prefixes into EIGRP.

**Common wrong answer:** Assuming OSPF-style automatic seed metrics always apply.

## Q3 — External vs internal preference

**Q:** Internal EIGRP vs external EIGRP to same prefix?

**Model answer:** Internal (90) beats external (170) if both present. Externals can lose to OSPF (110) even when “EIGRP is preferred” mentally.

**Common wrong answer:** Treating all EIGRP routes as AD 90.

## Q4 — Tags

**Q:** How do tags stop mutual redistribution loops?

**Model answer:** Tag on redistribute A→B; deny tagged routes when redistributing B→A. Combine with route-maps/prefix-lists. Tags are the standard loop-safety tool with dual redistribution points.

**Common wrong answer:** Relying only on AD without tags at two redistribution routers.

## Q5 — Default injection

**Q:** Ways to inject default into EIGRP?

**Model answer:** Redistribute a static default (with seed metric), advertise summary `0.0.0.0/0` on an interface, or legacy `default-network` patterns. Prefer explicit, filtered defaults at the edge.

**Common wrong answer:** Expecting EIGRP to originate default like OSPF `default-information originate` without config.

## Q6 — Filtering redistributed routes

**Q:** Where do you filter?

**Model answer:** Route-maps on `redistribute`, distribute-lists outbound, or prefix-lists at AF boundaries. Filter **before** wide advertisement; verify with topology and `show ip route`.

**Common wrong answer:** Filtering only on the RIB of the redistributing router while neighbors still learn via another path.

## Q7 — Interview red flag

**Q:** Mutual redistribution between EIGRP and OSPF at two border routers—what do you demand?

**Model answer:** Tags + directional route-maps, consistent seed metrics, documented preference (AD/distance), and a lab-proven failure test for loops and suboptimal routing.

**Common wrong answer:** “Just redistribute both ways everywhere.”

## Cross-links

[AD](../15_Redistribution_and_AD/01_Administrative_Distances.md), [Into EIGRP](../15_Redistribution_and_AD/02_Redistributing_into_EIGRP.md), [Mutual loops](../15_Redistribution_and_AD/06_Mutual_Redistribution_Loops.md).

---
