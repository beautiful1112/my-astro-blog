# Interview: Troubleshooting Scenarios

## Q1 — Framework

**Q:** Ordered EIGRP troubleshooting chain?

**Model answer:** **Neighbors → topology (successor/FS/Active) → RIB (AD/filters) → FIB/CEF → data plane**. Gather evidence (`show` before `debug`).

**Common wrong answer:** Immediate `debug eigrp packets` on a production core.

## Q2 — Neighbors not forming

**Q:** Top causes?

**Model answer:** AS mismatch, K mismatch, subnet/mask mismatch, ACL blocking proto 88 / 224.0.0.10, auth mismatch, passive interface, VRF mismatch, primary address issues.

**Common wrong answer:** Only checking “cable” while K-values differ.

## Q3 — Topology but not RIB

**Q:** Prefix in topology, missing from `show ip route`?

**Model answer:** Higher-preference protocol (lower AD) won; distribute-list; distance command; summary override; or route not successor-eligible. Compare `show ip eigrp topology` vs `show ip route` vs competing sources.

**Common wrong answer:** “EIGRP is broken” when static AD 1 wins.

## Q4 — Active forever / SIA

**Q:** Evidence and first checks?

**Model answer:** `show ip eigrp topology active`, event log, which neighbors fail to Reply, stub missing on spokes, giant query domain, congested WAN dropping Replies. Fix design boundaries; do not only tune timers.

**Common wrong answer:** Clearing neighbors repeatedly as the permanent fix.

## Q5 — Variance not sharing

**Q:** Config has variance but one path only?

**Model answer:** Alternate fails **FC**, metric outside N×FD, `maximum-paths` = 1, or CEF single path. Check topology flags for FS.

**Common wrong answer:** Raising variance without checking RD vs FD.

## Q6 — Redistribution silence

**Q:** Redistribute OSPF into EIGRP—neighbors see nothing?

**Model answer:** Missing **default-metric**/seed metric, route-map deny, wrong AF, or tags filtering. Confirm local EIGRP topology shows externals (`show ip eigrp topology` with external markers).

**Common wrong answer:** Assuming redistribute always injects without seed metric.

## Q7 — Asymmetry

**Q:** Control plane symmetric, traffic one-way failures?

**Model answer:** Separate forwarding issue: PBR, uRPF, NAT, firewall state, or return path via another routing domain. EIGRP adjacency ≠ bidirectional forwarding proof—traceroute/CEF both directions.

**Common wrong answer:** Flapping EIGRP to “fix” asymmetric firewall drops.

## Q8 — Auth rollover

**Q:** Key chain rollover caused outage—what went wrong?

**Model answer:** Non-overlapping accept/send lifetimes, or only one key send-lifetime active on one side. Plan overlapping accept windows; verify with neighbor drops correlating to key expiry.

**Common wrong answer:** “MD5 can’t roll without downtime” (it can with proper lifetimes).

## Cross-links

[Troubleshooting framework](../20_Troubleshooting/01_Troubleshooting_Framework.md), [Neighbors not forming](../20_Troubleshooting/02_Neighbors_Not_Forming.md), [Active and SIA](../20_Troubleshooting/06_Active_and_SIA.md).

---
