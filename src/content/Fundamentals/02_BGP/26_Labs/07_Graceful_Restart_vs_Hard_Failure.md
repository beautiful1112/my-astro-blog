# Lab: Graceful Restart vs Hard Failure

## Topology

Sender —— DUT (GR-capable) —— Receiver/helper. Backup path exists via alternate DUT-B with lower LP.

## Objectives

- Measure VIP loss with GR helper preserving stale path while DUT FIB is empty.
- Compare to hard session reset where backup LP path installs quickly.
- Tune or disable GR; re-measure.

## Config touchpoints

```text
router bgp 65000
 bgp graceful-restart
 neighbor <peer> fall-over bfd
! Helper stale timer platform-specific — set aggressively for the lab
```

## Tasks

1. Enable GR; simulate control-plane restart with forwarding stopped on DUT.
2. Capture loss duration and whether backup becomes best.
3. Disable GR; hard-fail DUT; measure again.

## Expected evidence

GR can extend blackhole vs hard fail + backup. Matches [GR case](../24_Practical_Cases/08_Graceful_Restart_Stale_Blackhole.md).

## Pass criteria

Record loss interval (ms), whether backup became best before stale expiry, and final runbook recommendation (GR on/off + stale bound) for this platform.
## Cross-links

Use the matching troubleshooting or interview note if this case appears in an incident; keep evidence (show output + probe) with the ticket.

---
