# Case: Graceful Restart Preserves a Blackhole

## Scenario

Edge restarts with Graceful Restart. Peers retain stale forwarding to the edge while its FIB is empty or mid-relearn. VIP traffic blackholes until stale timer expires—longer than a hard-fail + backup LP convergence would have taken.

## Expected evidence

```text
show bgp ipv4 unicast neighbors <edge>
! GR helper; stale paths marked
show ip route <vip>
! still points at restarting edge
# probes lose packets; backup path not chosen because stale path looks valid
```

## Config touchpoints

- Bound stale timers tightly on helpers for VIP edges.
- Prefer BFD + PIC with preinstalled backup when hard fail is acceptable.
- Disable GR on sessions where stale risk > restart benefit (trading edges often).

## Verification

Lab: kill forwarding on GR speaker without killing TCP immediately; measure loss duration with GR on vs hard reset. See [Interview: GR risk](../25_Interview_Questions/09_Graceful_Restart_Risk.md) and [lab](../26_Labs/07_Graceful_Restart_vs_Hard_Failure.md).

## Config / verification touchpoints

Capture pre/post `show bgp` (attributes), looking-glass or collector view, and a data-plane probe. Soft-clear only the affected peer/AF after policy edits; avoid global clears during proof.

## Lesson

GR preserves forwarding **statefulness assumptions**; stale ≠ working.
## Cross-links

Use the matching troubleshooting or interview note if this case appears in an incident; keep evidence (show output + probe) with the ticket.

---
