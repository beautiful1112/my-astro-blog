# Bandwidth and delay components

Under default K-values, EIGRP path quality is dominated by **minimum bandwidth** along the path and **cumulative delay**. Understanding interface units prevents TE mistakes when operators “set bandwidth” or “set delay” for traffic engineering.

## Bandwidth term

```text
BW_term = 10^7 / min_bandwidth_along_path_in_kbps
```

- Use the **slowest** link in the path (bottleneck), not the average.
- Interface `bandwidth` statement is the value EIGRP consumes (kbps), **not** negotiated line rate by magic—wrong `bandwidth` ⇒ wrong metric.
- Distinct from `ip bandwidth-percent eigrp` (control-plane pacing), see [Interface bandwidth and delay tuning](06_Interface_Bandwidth_Delay_Tuning.md).

## Delay term

```text
Delay_term = sum of interface delays along path
```

Cisco interface delay is shown in **microseconds** in `show interfaces`, but the EIGRP formula uses delay in **tens of microseconds** (divide display by 10 when doing classic hand math—verify against your training sheet and IOS behavior in the lab).

Delay **accumulates**; bandwidth takes the **minimum**. That asymmetry is intentional.

| Component | Path aggregation |
|---|---|
| Bandwidth | Minimum |
| Delay | Sum |

Related: [Composite metric formula](01_Composite_Metric_Formula.md), [Metric calculation worked example](07_Metric_Calculation_Worked_Example.md).

## Interface display reminder

```text
show interfaces GigabitEthernet0/0
! BW 1000000 Kbit, DLY 10 usec
```

Gigabit defaults often show DLY 10 usec; serial/WAN links show much larger delay—EIGRP prefers lower delay + higher min BW paths under defaults.

## Configuration patterns

### Cisco IOS / IOS XE — TE via delay (common)

```text
interface GigabitEthernet0/1
 delay 100
! units: tens of microseconds in the delay command (Cisco: delay in tens of usec)
```

Cisco `delay` command argument is in **tens of microseconds**. `bandwidth` command is in **kbps**.

```text
interface GigabitEthernet0/1
 bandwidth 100000
 delay 10
```

## Verification

```text
show interfaces GigabitEthernet0/1 | include BW|DLY
show ip eigrp topology
show ip route
```

Change delay on one parallel path; confirm successor flips without touching bandwidth.

## Risks

- Setting `bandwidth` to “shape” QoS while forgetting EIGRP metric impact.
- Confusing `delay` command units with `show interfaces` usec display.
- Tuning bandwidth on one side only → asymmetric routing surprises.

## Interview framing

“EIGRP’s default metric uses the path’s minimum bandwidth and the sum of delays—`bandwidth` and `delay` interface knobs are traffic-engineering tools that directly move DUAL successors.”

---
