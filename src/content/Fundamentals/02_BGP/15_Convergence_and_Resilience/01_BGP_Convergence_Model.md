# BGP Convergence Model

BGP convergence is the time from a topology or policy change until relevant speakers **select and install a stable replacement path**. User-visible loss can be shorter or longer than control-plane log timestamps depending on PIC, BFD, and stale forwarding.

## Typical sequence

1. **Failure detection** — BFD, Hold Timer, interface down, IGP next-hop loss.
2. **Session or next-hop invalidation** — Adj-RIB-In marked unusable; recursive NH fails.
3. **Withdrawal or replacement** — local best-path change; UPDATEs to peers.
4. **Policy and best-path recomputation** — every affected speaker.
5. **Advertisement propagation** — MRAI / update groups / RR chain.
6. **RIB and FIB programming** — main RIB, then hardware FIB.

Control-plane convergence ≠ data-plane recovery. PIC may repair forwarding before BGP finishes propagating; a stale GR next hop can leave BGP “stable” while traffic blackholes.

## Layers that add delay

| Layer | Example delay source |
|---|---|
| Detection | Hold Timer 180s vs BFD 50×3 ms |
| BGP pacing | MRAI, update packing |
| Path exploration | Transient longer AS_PATH before final |
| RR hiding | Backup never advertised |
| FIB | Batch programming, line-card queue |
| Underlay | IGP/LDP/SR reconvergence for NH |

## Measurement practice

Measure the **user-visible loss interval** (traffic counters, synthetic probes), not only BGP syslog. Correlate:

```text
t0 link/BFD down
t1 local BGP best-path change
t2 UPDATE sent / received on peer
t3 remote FIB change
t4 traffic restored
```

## Interactions

| Mechanism | Effect on model |
|---|---|
| **BFD** | Shrinks detection |
| **GR / LLGR** | May retain forwarding without full reconvergence |
| **Graceful shutdown** | Planned drain before session loss |
| **PIC / FRR** | Data plane may switch on shared NH object |
| **ADD-PATH** | Pre-positions alternate paths |

## Verification / lab

```text
show bgp ipv4 unicast <prefix>
show ip cef <prefix> detail
show bfd sessions
! induce failure; capture packet loss with continuous ping -f or traffic gen
```

## Interview framing

“BGP convergence is detection → invalidation → best-path → propagation → FIB; always separate control-plane timestamps from user-visible loss, and account for PIC and stale GR forwarding.”

---
