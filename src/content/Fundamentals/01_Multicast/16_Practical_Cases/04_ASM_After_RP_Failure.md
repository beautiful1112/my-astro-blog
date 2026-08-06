# Case 4: Existing ASM data survives RP failure

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Symptom

Established receivers continue receiving `S -> G`, but a new receiver gets nothing. Restarting an existing receiver can also make it fail. Monitoring still reports normal packet rate on the established receiver and the RP loopback may answer ping.

## Why this is possible

The established LHR already has `(S,G)` SPT state and receives directly from the source. Its data path no longer crosses the RP.

The new LHR starts with only group `G`. It must:

1. resolve `RP(G)`;
2. send `(*,G)` Join toward that RP;
3. rely on the RP to know or discover active source `S`; and
4. receive RPT data before it can switch to SPT.

If mapping, RP reachability, Register processing, MSDP/PIM Anycast synchronization, or the RP's native source Join is broken, that discovery path fails while old SPTs remain healthy.

## Investigation

Compare the working and failing LHRs:

```text
working: (S,G), source-facing IIF, SPT bit set, rising counters
failing: (*,G) only, RP-facing IIF, no source learned/data counters
```

Then verify:

1. identical `RP(G)` mapping on FHR, new LHR, and transit routers;
2. physical Anycast member selected by each side;
3. `(*,G)` Join arrival at the live RP;
4. FHR Data/Null-Registers reaching a live member;
5. MSDP SA or copied-Register synchronization between members;
6. RP `(S,G)` Join and RPF toward source; and
7. route withdrawal if an RP process failed while its loopback stayed up.

## Failure injection matrix

| Test | What it validates |
|---|---|
| keep established SPT running | data-plane independence from RP |
| add receiver during failure | mapping, RPT, source knowledge |
| start new source during failure | Register path and synchronization |
| force receiver to remain RPT | shared-tree data resiliency |
| break sync only | detects false confidence from healthy anycast routing |
| restart source after suppression | Null-Register/full Register recovery |

## Lesson

“Traffic survived RP failure” is incomplete. RP redundancy passes only when established RPT/SPT flows, new sources, new receivers, and state recovery all meet the convergence objective.
