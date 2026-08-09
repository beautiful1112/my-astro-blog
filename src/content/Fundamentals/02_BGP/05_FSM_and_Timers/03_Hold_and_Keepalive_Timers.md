# Hold and Keepalive timers

Peers negotiate the **Hold Time** as the minimum of the nonzero values proposed in OPEN (RFC 4271). A Hold Time of **zero** disables keepalive-based hold expiration (both sides must agree). **KEEPALIVE** messages are commonly sent at approximately **one-third** of Hold Time, though implementations may adjust.

If no KEEPALIVE, UPDATE, or other acceptable traffic resets the Hold Timer before expiry, the session resets and learned routes are withdrawn unless graceful-restart retention applies.

## Timer relationships

| Timer | Typical role |
|---|---|
| Hold Time | Max silence tolerated from peer |
| Keepalive interval | Usually Hold/3; refreshes peer’s hold timer |
| Update traffic | Also refreshes Hold Timer—silent idle peers need keepalives |

Aggressive timers accelerate detection but increase false resets during CPU congestion and **do not** detect pure forwarding failure on a path the TCP session is not using. **BFD** is often the clearer data-plane-adjacent mechanism.

Related: [KEEPALIVE and NOTIFICATION](../06_Messages_and_Capabilities/04_KEEPALIVE_and_NOTIFICATION.md), [FSM](01_Finite_State_Machine.md).

## Practical guidance

| Environment | Common approach |
|---|---|
| Internet eBGP | Moderate hold (e.g. 90s) + BFD or carrier detection where needed |
| DC/iBGP | BFD primary; BGP hold as backstop |
| Unstable CPU peers | Avoid sub-10s hold without proving control-plane headroom |
| Zero hold | Rare; disables keepalive hold mechanism—know the risk |

Exact defaults vary by vendor; always read negotiated values from the neighbor detail.

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 neighbor 198.51.100.1 timers 10 30
 ! keepalive 10, hold 30
```

### Junos

```text
set protocols bgp group EXT peer-as 64496
set protocols bgp group EXT neighbor 198.51.100.1
set protocols bgp group EXT hold-time 30
```

### FRRouting

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 neighbor 198.51.100.1 timers 10 30
```

## Interactions

| Mechanism | Interaction |
|---|---|
| BFD | Can tear down BGP long before Hold expiry |
| GR | Hold/restart timers interact with stale path retention |
| Large UPDATEs | Busy peers may delay keepalives—watch CPU and packing |
| Collision | Dual connections each run their own timer state briefly |

## Verification

```text
show bgp neighbors 198.51.100.1
! Hold time, keepalive interval, negotiated values
show ip bgp summary
```

Lab checks:

1. Propose 30 vs 90 → confirm negotiated 30.
2. Block BGP packets after Established → measure Hold expiry.
3. Enable BFD with long Hold → fail link; BFD wins detection race.

## Risks

- Sub-second ambitions on BGP timers instead of BFD → control-plane meltdown.
- Mismatched expectations when one side shows configured vs negotiated times.
- Zero hold disabling detection without another liveness mechanism.

## Interview framing

“Hold Time is negotiated as the lower nonzero OPEN proposal; keepalives usually run at about Hold/3; Hold expiry resets the session, but BFD is usually better for fast failure detection than tiny BGP timers.”

---
