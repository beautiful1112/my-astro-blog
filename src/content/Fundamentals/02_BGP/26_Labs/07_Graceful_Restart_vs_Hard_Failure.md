# Lab: Graceful Restart vs Hard Failure

## Objectives

Compare a BGP process restart with complete forwarding failure.

## Tasks

1. Establish redundant paths and enable GR.
2. Send continuous timestamped traffic.
3. Restart only the BGP process while forwarding remains active.
4. Record stale routes, End-of-RIB, and packet loss.
5. Repeat by shutting the data-plane interface or device.
6. Observe whether helpers retain a blackholing stale path.
7. Repeat with GR disabled or stale timers reduced.

## Result

Document which failure modes satisfy the core GR assumption: preserved forwarding.

---

