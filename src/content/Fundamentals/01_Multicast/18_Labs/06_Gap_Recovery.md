# Lab 6: Application gap recovery

Implement and measure A/B arbitration plus recovery under controlled loss.

## Topology

```text
Generator -- path A (delay/loss) --\
                                    Arbitrator / receiver process
Generator -- path B (delay/loss) --/
Unicast rewind mock server 192.0.2.50
```

Use groups `232.10.10.10` / `232.10.10.11`, sources `192.0.2.10` / `192.0.2.11`.

## Objectives

- First-copy arbitration, duplicate discard, bounded reorder, gap timer.
- Mock unicast replay and snapshot reset.
- Show buffer growth trading gaps for staleness.

## Config touchpoints

- Dual NICs or tc netem on two veth pairs.
- App knobs: `gap_timer_ms`, `reorder_window`, `snapshot_threshold`, `SO_RCVBUF`.

```text
tc qdisc add dev vethA root netem loss 1% delay 100us
tc qdisc add dev vethB root netem delay 300us
```

## Tasks

1. Run sequenced A/B feeds into an arbitrator.
2. Inject loss on A only—confirm B fills; no rewind.
3. Inject correlated loss—confirm gap timer and mock rewind.
4. Inject large gap—snapshot path; book resets.
5. Raise socket/ring buffers; measure gaps vs p99 latency.

## Failure injection

- Replay overlapping live sequences (duplicate handling).
- Disable rewind ACL—stale rule must fire.
- Share one CPU for both RX threads (false dual loss).

## Expected evidence

```text
gaps_a > 0, gaps_after_arb == 0 under A-only loss
recovery_ok under dual loss within timer
p99 latency rises when buffers hide micro-loss
```

## Cross-links

[A/B arbitration](../12_Quant_Trading_Market_Data/03_AB_Line_Arbitration.md), [Application reliability](../11_Host_and_Application/08_Application_Reliability.md), [Loss vs latency](../12_Quant_Trading_Market_Data/04_Loss_vs_Latency.md).

---
