# Connection collision and passive mode

Both BGP peers may initiate TCP simultaneously. RFC 4271 **connection collision detection** uses BGP Identifiers and connection state so that only one connection remains for the pair; the other is closed. Brief duplicate TCP sessions during establishment are therefore **not necessarily a fault**.

**Passive mode** prevents a speaker from initiating while still accepting inbound connections. It simplifies firewall rules and route-server scaling, but **both sides must not be passive** unless an external initiator exists—otherwise the session stays Idle/Active forever.

## Collision resolution (conceptual)

When two parallel connections exist between the same peers:

1. Compare BGP Identifiers of the two speakers.
2. Based on RFC rules and which connection is in which state, close one connection with a Cease/collision-resolution style NOTIFICATION (implementation details vary in logging).
3. Continue establishment on the surviving connection.

Operators should not “fix” transient dual SYNs during bring-up unless they persist after Established.

Related: [TCP 179](01_TCP_179.md), [FSM](../05_FSM_and_Timers/01_Finite_State_Machine.md), [NOTIFICATION reasons](../05_FSM_and_Timers/05_NOTIFICATIONS_and_Reset_Reasons.md).

## When to use passive

| Scenario | Typical choice |
|---|---|
| Route server with many clients | RS active or clients passive—pick one consistent model |
| Strict firewall: only one side may open | Make the firewalled side passive |
| Both sides behind conflicting NAT | Prefer explicit initiator + passive, or redesign addressing |
| Debugging collision flaps | Temporarily make one side passive to stabilize |

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 neighbor 198.51.100.1 transport connection-mode passive
```

### Junos

```text
set protocols bgp group EXT neighbor 198.51.100.1 passive
```

### FRRouting

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 neighbor 198.51.100.1 passive
```

Also ensure router-IDs are unique and stable; collision logic depends on identifiers.

## Interactions

| Mechanism | Interaction |
|---|---|
| Update-source | Colliding connections must still match neighbor endpoints |
| MD5/TCP-AO | Both candidate connections need correct keys |
| Peer dampening | Rapid collision/close loops can trigger idle-hold |
| Route servers | Passive clients reduce RS outbound connection scale |

## Verification

```text
show bgp neighbors 198.51.100.1
! Connection mode / passive indicator
show tcp brief | include 179
show bgp summary
```

Lab checks:

1. Both active with reachable paths: confirm eventual single Established session.
2. Both passive: confirm no session forever.
3. One passive: confirm only the active side’s ephemeral→179 pattern appears.

## Risks

- Interpreting collision NOTIFICATIONs as authentication failures.
- Dual passive after a maintenance change → silent overnight outage.
- Non-unique router-IDs → pathological collision behavior and hard-to-read logs.

## Interview framing

“If both peers open TCP at once, BGP collision detection keeps one connection using router-IDs; passive mode disables initiation on one side—useful for firewalls, fatal if both sides are passive.”

---
