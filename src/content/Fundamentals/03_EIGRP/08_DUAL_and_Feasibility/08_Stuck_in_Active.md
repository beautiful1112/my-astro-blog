# Stuck in Active

**Stuck-in-Active (SIA)** occurs when a router remains Active for a destination longer than the SIA timer because at least one queried neighbor has not replied. SIA is an operational failure mode of unbounded or unhealthy query domains—not a normal steady state.

## Causes

| Cause | Typical signal |
|---|---|
| Oversized query domain | Leaf flap Active across core |
| Neighbor too busy / high CPU | Slow or missing Replies |
| Uni-directional links / MTU / ACL dropping EIGRP | Queries out, Replies lost |
| Non-stub spokes queried | Hub waits on spoke that Queries further |
| Missing summarization | Specifics queried deep into remote regions |
| Flapping link | Repeated Active storms |

## Timers and SIA-Query

Historically, active-time was on the order of **3 minutes** (platform defaults vary; verify). Before declaring SIA and resetting the neighbor, modern IOS/XE uses **SIA-Query**: the Active router asks the slow neighbor whether it is still computing. If the neighbor answers SIA-Reply, the timer can be extended; if not, the neighbor is treated as stuck and the adjacency is reset to clear the computation.

```text
show ip eigrp neighbors detail
! Look for Q Cnt, SRTT, RTO, and Active/SIA indications
show ip eigrp topology active
```

Log patterns mention SIA and the prefix/neighbor involved—capture them in change windows.

## Design fixes (preferred over timer tweaks)

1. **EIGRP stub** on spokes — spokes reply and do not propagate queries into hub→spoke→hub chains.
2. **Interface summarization** at distribution/core boundaries — contain specifics.
3. Hierarchical addressing so summaries are natural.
4. Ensure ACLs allow EIGRP multicast/unicast (protocol 88) on relevant interfaces.
5. Stabilize detection (carrier-delay, BFD) to avoid false Active events—but do not “fix” SIA by only lengthening timers.

```text
Leaf failure --> Hub Active
Hub --bad--> Query floods core
Hub --good stub+summary--> Query stops at boundary
```

## Configuration pointers

```text
! Spoke stub (classic)
router eigrp 100
 eigrp stub connected summary

! Named
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  eigrp stub connected summary
```

Summarization and stub details: modules 10–11.

## Interview framing

“SIA = Active too long waiting for Reply. Root cause is usually query scope or packet loss. Fix with stub and summary; SIA-Query is a safety valve, not the design.”

## Related

- [Going Active and queries](06_Going_Active_and_Queries.md)
- [Designing the query domain](../09_Query_Scope_and_Convergence/06_Designing_the_Query_Domain.md)
- [Stub overview](../11_Stub_Filtering_and_Split_Horizon/01_EIGRP_Stub_Overview.md)

---
