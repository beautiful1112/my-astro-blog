# Query bounding in design

EIGRP’s blast radius is the **query domain**. Design it on purpose.

| Tool | Role |
|---|---|
| Stub | Spoke is not transit; hubs do not query it for remote prefixes |
| Summary | Query stops at the summarizer (plus discard) |
| Filter | Surgical, not a substitute for role |

```text
Spokes (stub) -- Hub -- summary -- Core
Query for a spoke prefix dies at hub/summary, not the whole company
```

A “flat EIGRP AS” with no stubs on a large WAN is how you buy SIA. CCDE will punish that even if the happy path works.

See [query scope](../../03_EIGRP/09_Query_Scope_and_Convergence/README.md).

## Interview framing

“Every EIGRP WAN I design has stubs on spokes and summaries at hubs. Query domain is a first-class failure domain.”

---
