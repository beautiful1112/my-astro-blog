# Update Pacing and MRAI

The **Minimum Route Advertisement Interval (MRAI)** idea limits how often a speaker advertises **new reachability** for a destination to a peer. Implementations differ on defaults, per-peer vs per-prefix timers, batching, and whether withdrawals are delayed.

## Why pacing exists

Without pacing, path exploration during convergence can emit a burst of intermediate AS_PATHs (route oscillation / path hunting). MRAI reduces UPDATE churn at the cost of delaying the **final** better path’s visibility.

## Implementation reality

| Aspect | Reality |
|---|---|
| Classic RFC idea | Per-prefix timer toward a peer |
| Many vendors | Per-peer / update-group batching |
| eBGP vs iBGP | Often different defaults |
| Withdrawals | Frequently sent without full MRAI delay |
| Address families | Separate update generation |

**Do not memorize one universal timer.** Read the platform doc for your train.

## Convergence interaction

```text
Failure → local selection → wait MRAI? → UPDATE → remote MRAI? → remote FIB
```

When debugging “slow convergence,” split:

1. Detection delay
2. Local compute
3. Advertisement pacing
4. Remote policy / RR
5. FIB install

## Configuration sketches

### Cisco (conceptual)

```text
router bgp 65000
 neighbor 192.0.2.2 advertisement-interval 0
! or leave default; 0 used cautiously on controlled iBGP
```

### Junos

```text
set protocols bgp group EBGP out-delay 0
```

Lowering to zero increases churn—use on dense iBGP fabrics only after scale testing.

## Interactions

| Mechanism | Relationship |
|---|---|
| **Route flap dampening** | Separate penalty system; do not confuse with MRAI |
| **Update groups** | Peers with identical outbound policy share packing |
| **ADD-PATH** | More paths → more UPDATEs even with pacing |
| **ORF / RTC** | Reduce *what* is sent; MRAI affects *when* |

## Verification

```text
show bgp neighbors 192.0.2.2
! Last update / update group
show bgp update-group
! correlate timestamps in debug/logs with FIB change
```

Operationally, correlate update timestamps with detection, best-path changes, and FIB installation.

## Interview framing

“MRAI-style pacing limits how fast BGP re-advertises a prefix to a peer, cutting churn but delaying final path visibility—defaults and withdrawal behavior are highly implementation-specific.”

---
