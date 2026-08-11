# Hierarchical addressing

EIGRP scales when the **address plan** matches the **topology**: contiguous blocks per site/region so summarization collapses the topology table and bounds queries.

## Why hierarchy matters

| Flat addressing | Hierarchical addressing |
|---|---|
| Summaries leak specifics | Aggregate fits on bit boundaries |
| Query reaches many routers | Query stops at summary edge |
| RIB growth linear with every VLAN | RIB growth with sites/regions |

EIGRP does not require VLSM hierarchy the way early OSPF myths claimed—but **without** summarizable blocks you cannot safely summarize.

## Addressing blueprint

```text
10.0.0.0/12   Enterprise
 10.0.0.0/16  Region A
  10.0.0.0/20   Site A1
  10.0.16.0/20  Site A2
 10.1.0.0/16  Region B
```

Hub advertises `10.0.0.0/16` toward other regions; site routers summarize `/20` toward hub.

```text
Core summary 10.0.0.0/12 --> Region A 10.0.0.0/16
C --> Region B 10.1.0.0/16
RA --> Site /20
RA --> Site /20
```

## Summary placement

| Layer | Typical summary |
|---|---|
| Access → distribution | VLAN aggregates |
| Site → WAN hub | Site /20 or /16 |
| Hub → remote | Default or regional aggregate |
| DC edge | DC aggregates only |

Always ensure **Null0** discard for locally generated summaries ([Summarization module](../10_Summarization/)).

## Overlap and holes

If Site A2 uses `10.50.0.0/24` carved from another region’s mental map, you cannot summarize cleanly—traffic may follow a summary into a blackhole. Audit with:

```text
show ip eigrp topology
show ip route summary
```

## Migration tactics

1. Allocate new hierarchical space; dual-stack advertise old + new.
2. Summarize only where the block is contiguous and complete enough.
3. Use leak-maps for exceptions instead of disabling the summary.

## Interview framing

“EIGRP summarization only helps when the address plan is hierarchical; flat VLAN islands force full topology and large query domains.”

## Exception handling

Use EIGRP leak-maps for the few prefixes that must pierce a summary. Document every leak as technical debt against the address plan.

## Related

- [Query Domain Architecture](02_Query_Domain_Architecture.md)
- [Stub and Summary Together](03_Stub_and_Summary_Together.md)
- [Default Route Injection](../15_Redistribution_and_AD/07_Default_Route_Injection.md)

---
