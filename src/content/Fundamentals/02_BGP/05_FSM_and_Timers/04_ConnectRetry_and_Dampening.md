# ConnectRetry and session retry behavior

**ConnectRetry** governs how soon BGP renews a transport attempt after a failed connection. Repeated **Active/Connect** oscillation usually indicates reachability, TCP, authentication, source-address, passive/collision, or ACL problems—**not** missing prefixes or route-map logic.

Implementations may apply exponential backoff, idle-hold, or peer dampening after rapid failures. Those protections stop a broken neighbor from burning control-plane resources but can **delay recovery** after the underlying fault is fixed. Always inspect the current retry/idle timer rather than assuming an immediate reconnect.

## Retry mental model

```text
Start / ConnectRetry expire
  -> TCP connect
  -> success: proceed toward OpenSent
  -> failure: Active, schedule ConnectRetry (possibly backed off)
Admin shutdown / dampen
  -> Idle until manually or timer-cleared
```

Related: [FSM](01_Finite_State_Machine.md), [TCP 179](../04_Sessions_and_Transport/01_TCP_179.md), [Collision and passive](../04_Sessions_and_Transport/04_Connection_Collision_and_Passive_Mode.md).

## Dampening vs route flap dampening

Do not confuse:

| Mechanism | Acts on |
|---|---|
| Session / peer dampening / idle-hold | Neighbor session establishment rate |
| BGP route flap dampening | Prefix advertisement instability (historical; often discouraged on Internet edge) |

This topic is about **session** retry behavior.

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 neighbor 198.51.100.1 timers connect 10
 ! platform-specific: bgp dampening for peers / idle-hold may differ
```

### Junos

```text
set protocols bgp group EXT neighbor 198.51.100.1
set protocols bgp connect-delay 60
# idle-after-switch-over and similar knobs exist on some platforms
```

### FRRouting

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 neighbor 198.51.100.1 timers connect 10
```

Exact names vary; verify against the OS version. After fixing root cause, explicitly clear idle-hold if the peer remains suppressed.

## Interactions

| Mechanism | Interaction |
|---|---|
| Passive mode | Local ConnectRetry initiation suppressed; peer must dial |
| MD5 mismatch | Infinite retry until key fixed—looks like “flapping Active” |
| Peer dampening | Extends Idle after repeated fails |
| BFD | Does not help if TCP never establishes |

## Verification

```text
show bgp neighbors 198.51.100.1
! Last reset, down for, connection retry timer
show ip bgp summary
show bgp neighbor 198.51.100.1 | match "retry|Idle|Active|dampen"
```

Lab checks:

1. Wrong password → Active loops; note ConnectRetry cadence.
2. Enable peer dampening if available; flap session; observe delayed recovery after fix.
3. Both passive → no ConnectRetry success ever; fix mode, not timers.

## Risks

- Tuning ConnectRetry lower under ACL failure → log spam and CPU waste.
- Leaving a peer in idle-hold after repair → “BGP still down” false mystery.
- Troubleshooting route absence while session never leaves Active.

## Interview framing

“ConnectRetry paces TCP re-attempts while Active; rapid Active/Connect loops are transport/auth/source problems, and idle-hold/dampening can hide recovery until you clear or wait out the backoff.”

---
