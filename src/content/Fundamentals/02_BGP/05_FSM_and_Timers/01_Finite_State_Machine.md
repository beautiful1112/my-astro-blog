# BGP finite-state machine

RFC 4271 defines BGP’s session **finite-state machine (FSM)**. Operators diagnose sessions faster from **state + last reset reason** than from repeated pings. Memorize transitions and—critically—what **Active** means (it does **not** mean working).

## Core states

```text
Idle -> Connect -> OpenSent -> OpenConfirm -> Established
          \-> Active --/
```

| State | Meaning |
|---|---|
| **Idle** | Resources reset; waiting for start event or retry backoff |
| **Connect** | TCP connection attempt in progress |
| **Active** | TCP attempt failed; listening and/or retrying |
| **OpenSent** | Local OPEN sent; waiting for peer OPEN |
| **OpenConfirm** | Peer OPEN acceptable; waiting for KEEPALIVE (or equivalent) |
| **Established** | UPDATE, KEEPALIVE, Route Refresh, NOTIFICATION permitted |

Related: [OPEN negotiation](02_OPEN_Negotiation.md), [Hold and Keepalive](03_Hold_and_Keepalive_Timers.md), [NOTIFICATION](05_NOTIFICATIONS_and_Reset_Reasons.md), [TCP 179](../04_Sessions_and_Transport/01_TCP_179.md).

## Reading stuck states

| Stuck in | Typical causes |
|---|---|
| Idle | Admin down, dampening/idle-hold, missing start |
| Active/Connect | Reachability, ACL, MD5, update-source mismatch, both passive |
| OpenSent | Peer not speaking BGP, ASN mismatch pending, filtered OPEN |
| OpenConfirm | Hold timer/capability issues, keepalive not exchanged |
| Established flapping | Hold expiry, NOTIFICATION, max-prefix, BFD down |

## Configuration patterns (admin control of FSM)

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 neighbor 198.51.100.1 shutdown
 ! no neighbor ... shutdown  -> start event
```

### Junos

```text
set protocols bgp group EXT neighbor 198.51.100.1
deactivate protocols bgp group EXT neighbor 198.51.100.1
# activate to start
```

### FRRouting

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 neighbor 198.51.100.1 shutdown
```

## Interactions

| Mechanism | Interaction |
|---|---|
| ConnectRetry | Governs re-entry from Active/Idle toward Connect |
| Hold Timer | Expiry from Established → back toward Idle with cleanup |
| Graceful restart | Special Established/restart paths retaining forwarding |
| Collision | May close one connection during OpenSent/OpenConfirm |

## Verification

```text
show bgp summary
show ip bgp neighbors 198.51.100.1
! BGP state = Established, last reset, notification error
show bgp neighbors 198.51.100.1 | include state|Last reset|Notification
```

Lab checks:

1. ACL drop TCP → observe Active/Connect oscillation, not “BGP policy fail.”
2. Wrong ASN → fail in OPEN exchange; read NOTIFICATION.
3. Raise Hold Timer; pull cable without BFD → measure time to leave Established.

## Risks

- Clearing neighbors in Active without capturing logs → lose root cause.
- Assuming Established means families and prefixes are good.
- Confusing FSM Active with “active route” in the BGP table.

## Interview framing

“BGP FSM runs Idle→Connect/Active→OpenSent→OpenConfirm→Established; Active means TCP failed and we are retrying, and state plus last NOTIFICATION beats ping for diagnosis.”

---
