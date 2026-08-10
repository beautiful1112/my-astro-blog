# How to study EIGRP

EIGRP rewards layered study. Memorizing “feasible distance must be less than reported distance” without knowing *when* a route goes Active, or knowing Hello timers without knowing query-domain design, produces interview answers that collapse under lab pressure. Study in four passes, then permanently keep a per-prefix checklist.

## Four passes

1. **Protocol mechanics:** neighbors, RTP, packet types, and the three tables (neighbor, topology, routing). Goal: explain what EIGRP *does* on the wire and in local tables. Start in [What EIGRP is](../02_Fundamentals/01_What_EIGRP_Is.md) and work through modules 03–06.
2. **DUAL and metrics:** successor / feasible successor, Passive vs Active, composite metric and K-values, wide metrics. Goal: predict which path is installed, when a query is sent, and why a neighbor fails to form. Later modules 06–07 deepen this.
3. **Design and bounding:** stub, summarization, query scope, variance/UCMP, named mode address families, VRF-aware process. Goal: design so SIA and uncontrolled query storms are rare—not just “make neighbors come up.”
4. **Operations and interviews:** evidence-based troubleshooting (mismatch tables, stuck-in-active, metric surprises), and trade-offs (classic vs named, bandwidth vs delay tuning). Goal: narrate diagnosis from `show` output, not from guesswork.

Do not skip pass 1 to “get to DUAL tricks.” Most production EIGRP bugs are still AS/K-value mismatches, passive-interface mistakes, wrong primary subnet, or unbounded queries after a link failure.

## Per-prefix checklist (always)

For every prefix under study or outage:

1. Is there a **neighbor up** on the expected interface (AS, K-values, timers, auth)?
2. Is the prefix present in the **topology table** via that neighbor (or another)?
3. Is there a **successor** (and optional **feasible successor**)? Passive or Active?
4. Was the successor **installed in the RIB** (AD 90/170 competition, variance multipath)?
5. Is the prefix **advertised** outbound as expected (stub filters, summaries, distribute-lists)?

Never treat “the EIGRP neighbor is up” as proof that useful routing is correct. A neighbor can exchange Hellos while a prefix is Active, missing from the topology table, losing RIB install to another protocol, or blocked by stub/summary policy.

## Evidence habits

| Habit | Why it matters |
|---|---|
| Capture neighbor down reason before clear | Clearing destroys the best clue |
| Compare local K-values vs Hello contents | Mismatch → no adjacency, often silent |
| Separate topology Passive from RIB install | Successor can exist yet lose AD battle |
| Trace one prefix through Active/query | Full-table stares hide SIA roots |
| Lab both failure and recovery | Hold, Active timer, and SIA-Query change timing |

## Suggested lab cadence

- Week mechanics: classic and named mode, Hello/Hold, static neighbor on NBMA, passive-interface.
- Week DUAL: force successor loss with and without FS; watch Query/Reply and Active time.
- Week design: stub + summary; measure which routers receive queries after a leaf failure.
- Week metrics: classic K1/K3 walkthrough, then wide metrics; break K-values once on purpose.

Document every lab with the five checklist answers for one prefix. That notebook becomes interview ammunition.

## Cross-links to keep open

- [EIGRP learning objectives](02_Learning_Objectives.md)
- [Three EIGRP tables](../06_Topology_Table_and_RIB/01_Three_EIGRP_Tables.md)
- [Successor and feasible successor](../06_Topology_Table_and_RIB/03_Successor_and_Feasible_Successor.md)
- [Query and Reply](../04_Packets_and_Transport/05_Query_and_Reply.md)
- [K-values and mismatch](../07_Metrics_and_K_Values/04_K_Values_and_Mismatch.md)

## Interview framing

“I study EIGRP as five questions per prefix—neighbor up, in topology, successor/FS, installed in RIB, advertised—and I never confuse a live adjacency with correct or bounded routing.”

---
