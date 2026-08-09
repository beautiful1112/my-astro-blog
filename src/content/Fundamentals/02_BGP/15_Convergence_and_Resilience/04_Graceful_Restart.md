# BGP Graceful Restart

RFC 4724 lets a **restarting** speaker ask peers (**helpers**) to retain routes temporarily while its control plane restarts, assuming the **forwarding plane continues** to forward.

## Message flow (simplified)

1. Capability negotiated: GR supported, per-AFI/SAFI flags, restart time.
2. Restarting speaker’s TCP session drops (process restart / NSF switchover).
3. Helper marks received routes **stale**, keeps forwarding.
4. Session re-establishes; restarting speaker re-advertises families.
5. **End-of-RIB** markers complete refresh; unmarked stale routes are deleted.
6. If restart timer expires first, helper flushes remaining stale state.

## Risk model

| Assumption true | Assumption false |
|---|---|
| Forwarding preserved → continuity | Forwarding dead → **blackhole** until stale flush |
| Shorter user loss on control restart | Longer blackhole than hard reset |

GR trades faster control-plane continuity for possible stale forwarding. It does **not** help when the whole device or the link to the peer dies (unless a redundant path exists).

## Configuration patterns

### Cisco

```text
router bgp 65000
 bgp graceful-restart
 bgp graceful-restart restart-time 120
 bgp graceful-restart stalepath-time 360
```

### Junos

```text
set protocols bgp graceful-restart
set routing-options graceful-restart
```

### FRR

```text
router bgp 65000
 bgp graceful-restart
```

Enable consistently on both sides for the families that must preserve state.

## Validation checklist

- Restart capability and family flags in OPEN.
- Forwarding-state preservation on the platform (NSF/NSR support).
- Stale path and restart timers.
- Behavior under: process restart, RP switchover, **complete device power loss**, link failure.

## Interactions

| Mechanism | Relationship |
|---|---|
| **LLGR** | Extends stale retention—[05](05_Long_Lived_Graceful_Restart.md) |
| **BFD** | Link failure usually bypasses GR usefulness |
| **PIC** | Complements GR when alternate NH exists |
| **Graceful shutdown** | Planned drain; different tool |

## Verification

```text
show bgp neighbors 192.0.2.2 | include Graceful
show bgp ipv4 unicast <prefix>
! Stale flag during restart window
```

## Interview framing

“Graceful Restart keeps helper routers forwarding previously learned paths while a peer’s control plane restarts; if forwarding did not survive, those stale routes blackhole until flushed.”

---
