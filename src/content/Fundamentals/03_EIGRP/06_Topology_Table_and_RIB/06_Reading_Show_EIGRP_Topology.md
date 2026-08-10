# Reading show EIGRP topology

Reading `show ip eigrp topology` fluently is an interview and NOC skill. Decode FD, the `(composite/RD)` pair, successor count, and when to escalate to `all-links` or a single-prefix query.

## Annotated example

```text
P 10.10.10.0/24, 1 successors, FD is 3072
        via 10.1.1.2 (3072/2816), GigabitEthernet0/0
        via 10.2.2.2 (3328/2816), GigabitEthernet0/1
```

| Token | Read as |
|---|---|
| `P` | Passive (stable). `A` would mean Active |
| `10.10.10.0/24` | Destination prefix |
| `1 successors` | Number of successors |
| `FD is 3072` | Feasible distance |
| `via 10.1.1.2 (3072/2816)` | Neighbor; **local metric** / **RD** |
| Second `via` | Likely FS if RD < FD and not equal-best |

Here: RD 2816 < FD 3072 for both; lower local metric 3072 is successor; 3328 path is FS if listed in default view.

Related: [Topology table entries](02_Topology_Table_Entries.md), [Composite metric formula](../07_Metrics_and_K_Values/01_Composite_Metric_Formula.md).

## Commands that change the view

```text
show ip eigrp topology
show ip eigrp topology all-links
show ip eigrp topology 10.10.10.0/24
show ip eigrp topology active
show eigrp address-family ipv4 topology
```

| View | Use |
|---|---|
| Default | Successors + FS |
| `all-links` | Plus infeasible paths |
| Specific prefix | Focus under pressure |
| `active` | Query-domain incidents |

## Composite vs wide metrics

Classic output shows scaled 32-bit composite values. With **wide metrics**, displays grow large (64-bit style) and RIB may show scaled “rib-scale” values—do not panic; compare consistently within the same mode. See [Wide metrics](../07_Metrics_and_K_Values/05_Wide_Metrics.md).

## Verification lab

1. Predict successor/FS from numbers before reading codes.
2. Find an infeasible path in `all-links`; explain failed FC.
3. Force Active; read `A` state and outstanding via information.

## Configuration patterns

No special config—literacy is the skill. Optional:

```text
router eigrp 100
 metric weights 0 1 0 1 0 0
```

Keep defaults while learning to read output.

## Risks

- Swapping metric and RD in `(3072/2816)`.
- Assuming second via is always FS without RD < FD check.
- Comparing classic composite to wide metric numbers across routers.

## Interview framing

“In `show ip eigrp topology`, FD is local feasible distance and `(metric/RD)` is path cost via the neighbor versus that neighbor’s reported distance—I use that to name successor and FS.”

---
