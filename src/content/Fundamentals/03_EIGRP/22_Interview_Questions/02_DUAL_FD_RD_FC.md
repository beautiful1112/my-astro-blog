# Interview: DUAL, FD, RD, and FC

## Q1 — What DUAL guarantees

**Q:** In one sentence, what does DUAL provide that classic DV lacked?

**Model answer:** DUAL provides **loop-free path selection and convergence** by combining a feasibility condition with a diffusion (query) process when no feasible successor exists—without requiring a full link-state database.

**Common wrong answer:** “EIGRP is a hybrid that floods LSAs like OSPF.” It remains distance-vector with DUAL.

## Q2 — RD vs FD

**Q:** Define Reported Distance and Feasible Distance precisely.

**Model answer:** **RD** is the metric a neighbor advertises to a destination (that neighbor’s distance). **FD** is the lowest metric the local router has recorded to that destination while the route was Passive—the feasibility baseline used in FC checks (commonly equal to the successor’s metric while Passive).

**Common wrong answer:** Swapping them (“FD is what the neighbor reports”).

## Q3 — Feasibility Condition

**Q:** State the Feasibility Condition and why it is loop-free.

**Model answer:** A neighbor’s path is feasible if **RD < FD**. Intuition: if the neighbor is strictly closer to the destination than we have ever considered ourselves (our FD), it cannot be using us as its next hop for that destination—so promoting it cannot create a loop.

**Common wrong answer:** “RD ≤ FD” or “any alternate path with higher bandwidth.” Strict inequality is the classic FC; variance does not replace FC.

## Q4 — Successor vs feasible successor

**Q:** Difference between successor and feasible successor?

**Model answer:** **Successor** is the neighbor providing the best path (lowest metric) installed in the RIB (subject to max-paths). **Feasible successor** is a loop-free alternate that passes FC but is not currently best; used for **local repair** without querying.

**Common wrong answer:** Calling every second-best path an FS even when RD ≥ FD.

## Q5 — Active vs Passive

**Q:** When does a prefix go Active, and what must happen to leave Active?

**Model answer:** Loss of successor **with no FS** → Active → Query neighbors → collect Replies → compute new successor → Passive. If any reply is missing past the Active timer path, SIA handling begins.

**Common wrong answer:** “Any metric change causes Active.” Many changes stay Passive if a successor/FS remains valid.

## Q6 — Local repair

**Q:** Why is an FS valuable operationally?

**Model answer:** Successor failure with an FS present allows **immediate** switchover and RIB update **without** a network-wide query diffusion—faster convergence and smaller query domain impact.

**Common wrong answer:** Assuming queries always run on every link failure.

## Q7 — SIA one-liner

**Q:** What is Stuck-in-Active?

**Model answer:** A router remains Active too long waiting for Replies (or SIA-Query/Reply exchange fails)—often due to overloaded links, large query domains, or unreachable query targets. Design fix: stub + summarization to bound queries.

**Common wrong answer:** “SIA means the neighbor is dead.” Neighbor may still be up while a prefix is SIA.

## Cross-links

[DUAL overview](../08_DUAL_and_Feasibility/01_DUAL_Overview.md), [FC](../08_DUAL_and_Feasibility/03_Feasibility_Condition.md), [SIA](../08_DUAL_and_Feasibility/08_Stuck_in_Active.md).

---
