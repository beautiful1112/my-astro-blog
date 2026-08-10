# Interview: Stub, Summary, and Query Scope

## Q1 — What stub actually does

**Q:** What does `eigrp stub` change about queries and advertisements?

**Model answer:** A stub router **signals stub** so hubs **do not query it** for routes (query boundary). It also **limits what the stub advertises** (default: connected + summary; options add static/redistributed; receive-only advertises nothing). Stub still **receives** routes from the hub unless filtered.

**Common wrong answer:** “Stub means the router does not receive any routes” or “stub only means no transit.”

## Q2 — Transit misconception

**Q:** Can a stub still forward transit traffic?

**Model answer:** Stub is a **control-plane** advertisement/query role. If the data plane has routes and forwarding is enabled, packets can still transit unless you also design addressing/filtering to prevent it. Stub is not a firewall.

**Common wrong answer:** Equating stub with “no IP forwarding.”

## Q3 — Summary as query boundary

**Q:** How does interface summarization reduce query scope?

**Model answer:** Downstream routers know only the summary. Queries for a **component** that is withdrawn may be answered at the summarizer (Null0/local knowledge) instead of flooding past the summary boundary—shrinking the Active domain.

**Common wrong answer:** “Summaries only shrink the RIB; queries always flood everywhere.”

## Q4 — Auto-summary risk

**Q:** Why is auto-summary dangerous in modern designs?

**Model answer:** Classful auto-summary can create **incorrect aggregates and blackholes** across discontinuous subnets. Best practice: **no auto-summary** and explicit interface summaries with Null0.

**Common wrong answer:** “Auto-summary is harmless if everything is /24.”

## Q5 — Hub-spoke checklist

**Q:** Minimum design for hub-spoke EIGRP WAN regarding queries?

**Model answer:** Spokes as **stub**; hub summarizes toward spokes or core; avoid querying spokes; watch split-horizon on multipoint hubs for spoke-to-spoke needs (or use DMVPN Phase 3 / spoke-hub-spoke).

**Common wrong answer:** Full mesh of queries with no stubs “for faster convergence.”

## Q6 — Query vs FS repair

**Q:** When do you not need a query at all?

**Model answer:** When a **feasible successor** exists—local repair stays Passive. Queries are the expensive path when no FS is present.

**Common wrong answer:** Designing as if every failure triggers full-network SPF (OSPF mental model).

## Q7 — Interview design prompt

**Q:** “SIA storms after WAN flaps”—first design answers?

**Model answer:** Enable stub at edges, summarize at aggregation layers, shrink AS diameter of detailed prefixes, verify no accidental query into large campus leaves, check bandwidth-percent/pacing so Replies are not starved.

**Common wrong answer:** Only lowering SIA timers without bounding the query domain.

## Cross-links

[Stub overview](../11_Stub_Filtering_and_Split_Horizon/01_EIGRP_Stub_Overview.md), [Query domain design](../09_Query_Scope_and_Convergence/06_Designing_the_Query_Domain.md), [Summarization and queries](../10_Summarization/07_Summarization_and_Query_Reduction.md).

---
