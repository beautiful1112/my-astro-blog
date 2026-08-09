# NOTIFICATION and reset reasons

A **NOTIFICATION** identifies a fatal BGP condition and normally closes the session (RFC 4271). Categories include Message Header Error, OPEN Message Error, UPDATE Message Error, Hold Timer Expired, Finite State Machine Error, and Cease. **Cease** subcodes clarify administrative shutdown, max-prefix, resource exhaustion, configuration change, connection rejected, collision resolution, and related causes (see RFC 4486 and updates).

Modern **UPDATE error handling** (RFC 7606) avoids resetting an entire session for many malformed attributes by treating affected NLRI as withdrawn instead. Always capture the exact code/subcode and peer log **before** manually clearing the session.

## Error categories (operator view)

| Code class | Typical meaning | Operator action |
|---|---|---|
| Header | Bad marker/length/type | Capture, check middleboxes/bugs |
| OPEN | ASN, hold, capability, identifier issues | Fix config/capability mismatch |
| UPDATE | Attribute/NLRI problems | Prefer 7606 treat-as-withdraw analysis |
| Hold Timer | Silence too long | Check congestion, CoPP, timers, path |
| FSM | Unexpected event for state | Bug or race; preserve logs |
| Cease | Admin/policy/resource/collision | Read subcode carefully |

Related: [KEEPALIVE and NOTIFICATION messages](../06_Messages_and_Capabilities/04_KEEPALIVE_and_NOTIFICATION.md), [Treat-as-withdraw](../06_Messages_and_Capabilities/07_Error_Handling_Treat_as_Withdraw.md), [FSM](01_Finite_State_Machine.md).

## Administrative shutdown communication

Many platforms send Cease with a shutdown diagnostic string so the peer’s log explains *why*. Use it during maintenance instead of silent link pulls when possible (see also graceful shutdown communities in later modules).

## Configuration patterns (controlled resets)

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 neighbor 198.51.100.1 shutdown
 ! optional: neighbor ... description / hard reset with message where supported
 clear ip bgp 198.51.100.1
```

### Junos

```text
set protocols bgp group EXT neighbor 198.51.100.1
deactivate protocols bgp group EXT neighbor 198.51.100.1
clear bgp neighbor 198.51.100.1
```

### FRRouting

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 neighbor 198.51.100.1 shutdown
!
clear bgp 198.51.100.1
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Max-prefix | Often Cease when threshold hit |
| Collision | Cease while retaining other connection |
| RFC 7606 | Reduces UPDATE-driven session Ceases |
| GR | Reset reasons interact with whether stale paths remain |

## Verification

```text
show bgp neighbors 198.51.100.1
! Last reset, notification error code/subcode
show log | include BGP|Notification
```

Lab checks:

1. ASN mismatch → OPEN error; record code/subcode both sides.
2. Max-prefix exceed → Cease subcode; confirm automatic vs manual recovery.
3. Malformed attribute on 7606-capable peer → session stays up; prefix disappears—contrast with classic reset.

## Risks

- Clearing immediately → destroys NOTIFICATION evidence.
- Reading only local “peer closed” without peer’s sent code.
- Assuming every prefix loss implies NOTIFICATION—policy and treat-as-withdraw also withdraw silently from a session perspective.

## Interview framing

“NOTIFICATION carries an error code/subcode and usually resets the session; Cease subcodes explain admin/max-prefix/collision events, and RFC 7606 means some UPDATE faults no longer kill the whole peer.”

---
