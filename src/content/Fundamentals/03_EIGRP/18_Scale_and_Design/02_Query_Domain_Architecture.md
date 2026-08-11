# Query domain architecture

When EIGRP loses its successor and has no feasible successor, it goes **Active** and **queries** neighbors. The set of routers that may receive those queries is the **query domain**. Design’s job is to keep that domain small.

## What expands the domain

| Factor | Effect |
|---|---|
| No stubs | Queries fan out to leaves |
| No summaries | Queries follow every specific |
| Full mesh WAN | Each peer may query others |
| Redistributed instability | Externals flap → repeated Active |

## What shrinks the domain

| Tool | How it bounds queries |
|---|---|
| **Stub** | Stub routers respond that they are stub; not queried as transit |
| **Summary** | Downstream specifics hidden; Active scope shrinks |
| **AS boundary** | Separate EIGRP AS / redistribute carefully |
| **Filter** | Reduce learned prefixes that can go Active |

```text
Core --> Hub
H --> Stub spoke
H --> Stub spoke
Core --query bounded--> H
H --no fanout--> St1
```

## Architecture patterns

### Campus

- Core/distribution non-stub.
- Access as stub or passive-only (no adjacency).
- Summaries at distribution toward core.

### WAN hub-spoke

- Spokes stub.
- Hub summarizes site aggregates or sends default.
- Dual hubs: ensure both have consistent summaries to avoid asymmetric query behavior.

### Dual-region

- Regional EIGRP processes or summary borders.
- Avoid one flat AS spanning global WAN without stubs.

## SIA relationship

Stuck-In-Active occurs when a query is unanswered until `active-time` expires (default 3 minutes). Large domains + lossy WAN → SIA storms. Architecture > timer tweaking.

```text
show ip eigrp topology active
show ip eigrp neighbors detail
```

## Interview framing

“Design the query domain with stubs and summaries before tuning SIA timers; timers are a safety net, not a scale strategy.”

## Related

- [Stub and Summary Together](03_Stub_and_Summary_Together.md)
- [Active and SIA](../20_Troubleshooting/06_Active_and_SIA.md)
- [SIA Storm Without Stub](../21_Practical_Cases/03_SIA_Storm_Without_Stub.md)

---
