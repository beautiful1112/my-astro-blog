# Why summarize in EIGRP

Summarization replaces many specific prefixes with a shorter aggregate advertised across a boundary. In EIGRP it serves three jobs at once: **scale**, **stability**, and **query containment**.

## Benefits

| Goal | Effect |
|---|---|
| Smaller topology/RIB | Fewer prefixes in core and on low-end spokes |
| Hide churn | Flaps of components behind a summary do not Update the far side for each specific |
| Bound Queries | Remotes without specifics exit Active searches sooner |
| Policy boundaries | Natural place for traffic engineering / filtering |

## Costs and constraints

- **Loss of path information**: core cannot prefer one component’s exit over another unless you leak specifics or use multiple summaries.
- **Black holes**: summary advertised while all components are down (mitigate with Null0 + careful withdrawal behavior).
- **Discontiguous subnets**: aggregate claims space you do not own elsewhere → suboptimal or looping paths.
- **Asymmetric designs**: summarizing only one side of a redundant pair can attract traffic incorrectly.

## Where to summarize

Prefer **distribution → core** and **hub → core**, not random access interfaces. Align summary masks with the IP allocation plan.

```text
Site A 10.10.0.0/16   Site B 10.20.0.0/16
Dist-A advertises 10.10.0.0/16
Dist-B advertises 10.20.0.0/16
Core carries two prefixes, not hundreds of /24s
```

## EIGRP-specific note

Unlike link-state areas, EIGRP has no mandatory area hierarchy—**summarization is optional configuration**. Flat EIGRP with no summaries is legal and often painful at scale.

## Before / after ops picture

```text
Before: core topology has 500 EIGRP specifics; leaf flap → Active deep in core
After:  core has ~20 summaries; leaf flap Active stays in distribution
```

Prove with `show ip eigrp topology active` during a controlled access failure.

## Interview framing

“Summarize for table size and for DUAL query scope. Place summaries at hierarchy edges with Null0, never as a substitute for a coherent address plan.”

## Related

- [Interface summarization](03_Interface_Summarization.md)
- [Summarization as query boundary](../09_Query_Scope_and_Convergence/04_Summarization_as_Query_Boundary.md)
- [Null0 discard route](04_Null0_Discard_Route.md)

---
