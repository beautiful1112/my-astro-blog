# KEEPALIVE and NOTIFICATION messages

**KEEPALIVE** (type 4) contains only the common header and refreshes liveness without carrying routing changes. Any valid **UPDATE** also refreshes the Hold Timer, so a busy session may send few pure KEEPALIVEs.

**NOTIFICATION** (type 3) contains an error code, subcode, and optional diagnostic data. Once sent or received, the session normally closes and BGP cleans up routes learned from that peer (unless graceful-restart retention applies).

## KEEPALIVE role in the FSM

| Phase | Role |
|---|---|
| OpenConfirm | Expected to complete establishment after OPENs accepted |
| Established | Periodic liveness when UPDATEs are idle |
| Hold Timer | Receipt resets the hold timer |

Related: [Hold and Keepalive timers](../05_FSM_and_Timers/03_Hold_and_Keepalive_Timers.md), [NOTIFICATION reset reasons](../05_FSM_and_Timers/05_NOTIFICATIONS_and_Reset_Reasons.md), [Common header](01_Common_Message_Header.md).

## NOTIFICATION body

```text
Error Code | Error Subcode | Data ...
```

Logs on both ends may differ: one reports the protocol error it sent, while the other records a remote close. Correlate timestamps and, when needed, packet captures.

## Configuration patterns (timer-driven keepalives)

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 neighbor 198.51.100.1 timers 10 30
```

### Junos

```text
set protocols bgp group EXT hold-time 30
set protocols bgp group EXT neighbor 198.51.100.1
```

### FRRouting

```text
router bgp 65000
 neighbor 198.51.100.1 timers 10 30
```

Administrative NOTIFICATION generation often happens via `shutdown` / deactivate with optional cease messages.

## Interactions

| Mechanism | Interaction |
|---|---|
| Hold Time 0 | Keepalive-based hold expiry disabled |
| BFD | May supersede keepalive detection speed |
| Cease subcodes | Explain why a NOTIFICATION was sent administratively |
| Large update load | Starvation of keepalive send path can false-trip hold |

## Verification

```text
show bgp neighbors 198.51.100.1
! last keepalive, hold timer, notification errors
show log | include Notification|Cease|Hold
```

Lab checks:

1. Established idle session: capture periodic KEEPALIVEs at ~Hold/3.
2. Block packets: Hold expires; NOTIFICATION/hold expiry logged.
3. `neighbor shutdown`: peer sees Cease; compare messages both sides.

## Risks

- Assuming lack of KEEPALIVE packets means a dead session while UPDATEs are flowing.
- Clearing before reading NOTIFICATION data.
- Ignoring asymmetric log detail (sender vs receiver).

## Interview framing

“KEEPALIVE is a header-only liveness message that refreshes Hold Time; NOTIFICATION carries error code/subcode and almost always tears the session down—always read both peers’ logs.”

---
