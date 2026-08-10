# EIGRP learning objectives

These objectives define “done” for a serious EIGRP study path. Use them as a checklist before interviews or production ownership. Linked modules below are the primary study homes; later lessons deepen each item.

## Protocol core and process model

You should be able to:

- explain EIGRP as an **advanced distance-vector** protocol using DUAL, historically Cisco-proprietary with informational **RFC 7868** ([What EIGRP is](../02_Fundamentals/01_What_EIGRP_Is.md));
- contrast EIGRP’s niche vs RIP and vs OSPF/IS-IS for enterprise campus/WAN ([Why EIGRP exists](../02_Fundamentals/02_Why_EIGRP_Exists.md), [EIGRP vs OSPF vs IS-IS](../02_Fundamentals/06_EIGRP_vs_OSPF_vs_IS_IS.md));
- dispel the “hybrid” marketing myth: still DV with triggered/partial updates—no full LSDB flood ([Advanced distance vector](../02_Fundamentals/03_Advanced_Distance_Vector.md));
- separate control-plane learning from data-plane forwarding ([Control plane versus data plane](../02_Fundamentals/04_Control_Plane_vs_Data_Plane.md));
- use precise terminology: FD, RD, successor, FS, Active/Passive, RTP, SIA, K-values, variance, stub, named mode ([Core terminology](../02_Fundamentals/05_Core_Terminology.md));
- explain AS number as **local process identity** for neighbor match, not Internet ASN semantics ([AS number in EIGRP](../03_Process_and_Address_Families/01_AS_Number_in_EIGRP.md));
- configure and reason about **classic vs named mode**, address families, RID, and VRF-aware EIGRP (module 03).

## Packets, neighbors, and tables

You should be able to:

- explain IP protocol **88**, RTP reliability, and when multicast vs unicast is used (module 04);
- name packet types: Hello, Update, Query, Reply, ACK, SIA-Query, SIA-Reply;
- form and diagnose neighbors: AS, K-values, primary subnet, auth, timers, passive/static neighbors (module 05);
- map the three tables and read topology output for FD/RD/successor/FS (module 06);
- predict RIB install with AD **90** internal / **170** external and variance multipath.

## Metrics, DUAL, and design

You should be able to:

- compute classic composite metric with default K1=K3=1 and explain bandwidth/delay roles (module 07);
- explain why K-value mismatch prevents adjacency and when wide metrics matter;
- narrate Passive → Active → Query → Reply (or SIA) for a prefix without an FS;
- design stub and summarization to **bound the query domain**;
- tune interface bandwidth/delay knowingly (including `ip bandwidth-percent` vs `bandwidth`).

## Ops and interview bar

You should be able to:

- troubleshoot common neighbor mismatches from symptoms to root cause;
- distinguish “no FS so Active” from “RIB install lost to OSPF”;
- note FRRouting’s limited/no classic EIGRP support and Junos rarity—Cisco IOS/XE is the primary ops surface;
- defend design choices (stub, summary, named mode) with failure-domain language.

## Self-check format

For each objective, demand three artifacts:

1. A one-sentence definition accurate enough for an interview.
2. A lab or packet/CLI proof you have actually seen.
3. One failure mode and how you would detect it.

If you can only recite the sentence, the objective is not met.

## Interview framing

“My EIGRP bar is: explain RTP and the three tables, apply DUAL with FD/RD and Active queries, compute metrics and K-value traps, and defend stub/summary query bounding with evidence—not with ‘hybrid protocol’ slogans.”

---
