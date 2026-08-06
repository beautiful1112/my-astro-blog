# Lab 5: PIM-SM phases

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Goal

Observe every PIM-SM ASM transition and prove which state/data event causes the next one.

## Topology and instrumentation

Use separate source, RP, and receiver locations with captures on:

- source LAN/FHR;
- FHR-to-RP control path or RP interface;
- RP source-facing and RPT-facing interfaces;
- LHR RPT-facing and source-SPT-facing interfaces; and
- receiver LAN.

Generate sequenced UDP packets slowly enough that captures remain readable. Record the initial MRIB result toward both `S` and RP on every router.

## Exercise A: receiver first

1. Join `G` at the receiver without starting `S`.
2. Decode the membership report.
3. Follow `(*,G)` Join hop by hop to the RP.
4. Record IIF, OIL reason, and timers at every hop.
5. Start `S` and identify the full Data Register outer/inner headers.
6. Confirm RP decapsulation and first packet on the RPT.
7. Observe RP `(S,G)` Join toward source and native packet arrival.
8. Observe Register-Stop at the FHR.
9. Wait for and decode a Null-Register probe.
10. Trigger LHR SPT switch; observe `(S,G)` Join, SPT bit, and `(S,G,rpt)` Prune.

## Exercise B: source first

1. Start `S` with no receivers.
2. Explain why the RP sends Register-Stop and whether it retains source state.
3. Add the receiver.
4. Measure time until registration/native Join makes data available.
5. Compare first-packet delay with receiver-first ordering.

## Exercise C: failure during each phase

Repeat with one event at a time:

- drop Register-Stop;
- break RP RPF toward `S`;
- change LHR source RPF during SPT switch;
- remove the final receiver;
- fail the RP after SPT has established; and
- add a new receiver while the RP is unavailable.

## Deliverables

Create a timeline containing packet timestamps and corresponding state snapshots:

```text
time | control/data event | router | state created/removed | IIF | effective OIL
```

Draw RPT and SPT separately, label RPF neighbor at each hop, and explain any loss, duplicate, or reordering interval. The lab is complete only when packet captures, TIB/mroute state, and MFIB counters agree.
