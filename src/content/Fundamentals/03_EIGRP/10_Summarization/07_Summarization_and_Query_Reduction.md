# Summarization and query reduction

Summarization is a primary **query-reduction** tool in EIGRP designs. Combined with stub, it keeps Active computations inside the region that actually hosts the component prefixes.

## Mechanism recap

1. Components exist only behind the summarizing router(s).
2. Upstream neighbors install the aggregate, not each /24.
3. On component failure, Active/Query stays meaningful among routers that know the specific.
4. Routers with only the summary do not usefully deepen the search for that specific.

```text
Without summary: Query(10.10.1.0/24) may walk the whole AS
With summary:    far-side routers never learned 10.10.1.0/24 → domain shrinks
```

## Synergy with stub

| Tool | Bounds |
|---|---|
| Stub | Edge routers as non-transit query leaves |
| Summary | Hierarchy edge hides specifics from core/remotes |

Use both in hub-spoke + hierarchical campus. Neither alone fixes a flat, fully meshed, non-summarized core with non-stub leaves.

## Test plan

1. Baseline: shut a component interface; record which routers show Active.
2. Add distribution summary; repeat; core Active should disappear for that specific.
3. Add spoke stub; repeat spoke-failure scenarios; hubs should not wait on spokes as transit.
4. Add a leak-map specific; confirm that specific can Active farther than siblings—expected trade-off.

## Ops red flags

- Core `topology active` for access /24s.
- SIA tickets after branch flaps.
- Topology table in core listing thousands of EIGRP specifics.

## Combined control set

```text
Spoke:   eigrp stub connected summary
Dist:    ip summary-address eigrp 100 <site>/16 toward core
Core:    should not list site /24s; Active empty on spoke link shut
```

If core still shows the /24, a leak-map, redistribution, or wrong summary interface is re-injecting specifics.

## Interview framing

“Ask ‘who knows the specific?’ That set is your query domain. Summarize so the core does not know; stub so spokes are not asked.”

## Related

- [Summarization as query boundary](../09_Query_Scope_and_Convergence/04_Summarization_as_Query_Boundary.md)
- [Designing the query domain](../09_Query_Scope_and_Convergence/06_Designing_the_Query_Domain.md)
- [Stuck in Active](../08_DUAL_and_Feasibility/08_Stuck_in_Active.md)

---
