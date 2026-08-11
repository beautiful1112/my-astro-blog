# Active and SIA

**Active**: no successor/FS; router queries neighbors for prefix P.  
**SIA (Stuck-In-Active)**: query outstanding beyond active-time (default 180s); neighbor may be reset for that dependency.

## Evidence

```text
show ip eigrp topology active
show ip eigrp events
show logging | include SIA|stuck
show ip eigrp neighbors detail
```

Note which neighbor did not reply and which prefix.

## Root-cause classes

| Class | Mechanism |
|---|---|
| Large query domain | Non-stub spokes queried |
| Lost replies | Congestion, unidirectional failure |
| Slow router | CPU/memory starved peer |
| Filter blackhole | Peer receives query but cannot answer usefully |
| Flapping source | Repeated Active storms |

## Remediation priority

1. **Stub spokes** + **summaries** (architecture).
2. Fix lossy links causing missed replies.
3. Ensure hubs not overloaded with debug.
4. Only then consider `timers active-time` changes (masking).

```text
Successor lost, no FS --> Query domain
Q --> Replies → new successor
Q --> Timeout → SIA
```

## Temporary ops actions

- Stabilize flapping interface.
- Confirm stub on leaves.
- During incident: identify furthest non-replying hop via events.

Do not clear all neighbors as first response—widens the blast.

## Interview framing

“SIA means a query went unanswered—shrink the query domain with stubs/summaries; do not just raise the timer.”

## Active vs FS miss

If a backup path should have been FS, the prefix should not go Active. Investigate FC/metrics ([Variance Blocked by FC](../21_Practical_Cases/05_Variance_Blocked_by_FC.md)) separately from SIA storms. Active is normal when no FS exists; SIA means the query process itself failed.

## Related

- [Query Domain Architecture](../18_Scale_and_Design/02_Query_Domain_Architecture.md)
- [SIA Storm Without Stub](../21_Practical_Cases/03_SIA_Storm_Without_Stub.md)
- [EIGRP Event Log](../19_Operations_and_Observability/02_EIGRP_Event_Log.md)

---
