# Route Flaps and Session Resets

Separate **session flaps** (FSM leaves Established) from **route flaps** (NLRI advertise/withdraw while session stays up).

## Session resets — inspect

- NOTIFICATION code/subcode and both-end logs.
- Hold timer expiry vs explicit cease (admin reset, max-prefix).
- BFD down correlating with interface errors.
- Capability / attribute errors (malformed UPDATE).
- Auth failures after key rotation.

```text
show bgp ipv4 unicast neighbors 192.0.2.1
! Last reset, notification
show logging | include BGP|BFD
```

## Route flaps — inspect

- Unstable IGP under next hop.
- Aggressive performance-based LOCAL_PREF controllers.
- Unstable ROA / RTR → Valid/Invalid churn.
- Conditional advertisement thrashing on a flapping trigger prefix.
- Interface/BFD flapping without session kill (PIC churn).

## Mitigation patterns

| Problem | Approach |
|---|---|
| Max-prefix hit | Raise limit only after validating peer; use warning threshold |
| BFD too aggressive | Raise timers; fix Layer-1; hysteresis ([case](../24_Practical_Cases/12_Fast_BFD_Causes_Path_Oscillation.md)) |
| GR stale blackhole | Bound stale timer; prefer hard fail when backup ready ([case](../24_Practical_Cases/08_Graceful_Restart_Stale_Blackhole.md)) |
| Policy oscillation | Hold-downs; dampening as last resort |

Capture PCAPs for unexplained NOTIFICATIONs—see [Packet Capture](../21_Operations_and_Observability/06_Packet_Capture_and_Message_Decoding.md).

## Logging correlation

Align BGP last-reset timestamps with BFD, interface err-disabled, and RTR down events. A single root cause often fans out into “many symptoms.” Prefer fixing Layer-1 or policy oscillation over enabling dampening as the first response.

---
