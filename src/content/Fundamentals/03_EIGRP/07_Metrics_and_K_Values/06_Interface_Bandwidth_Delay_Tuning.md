# Interface bandwidth and delay tuning

Operators traffic-engineer EIGRP with interface **`bandwidth`** and **`delay`**. A third knob, **`ip bandwidth-percent eigrp`**, is **not** a metric input—it limits how much interface bandwidth EIGRP control traffic may consume. Confusing these three causes outages and bad TE.

## Three knobs

| Knob | Affects metric? | Purpose |
|---|---|---|
| `bandwidth` | **Yes** (min BW term) | Declared kbps for routing/QoS consumers |
| `delay` | **Yes** (sum delay term) | Preferred EIGRP TE lever on parallel links |
| `ip bandwidth-percent eigrp` | **No** | Cap EIGRP pacing / control plane share |

Related: [Bandwidth and delay components](02_Bandwidth_and_Delay_Components.md), [Composite metric formula](01_Composite_Metric_Formula.md).

## Practical TE guidance

```text
Prefer: raise delay on backup path (successor stays primary)
Avoid: fake bandwidth that also breaks QoS/monitoring assumptions
Never: assume bandwidth-percent changes path selection
```

```text
Primary Gi0/0: delay 10
Backup  Gi0/1: delay 1000
-> successor prefers Gi0/0 under default Ks
```

## Configuration patterns

### Cisco IOS / IOS XE

```text
interface GigabitEthernet0/0
 bandwidth 1000000
 delay 10
 ip bandwidth-percent eigrp 100 50
!
interface GigabitEthernet0/1
 bandwidth 1000000
 delay 1000
```

Named mode timers/percent often sit under `af-interface`:

```text
router eigrp CAMPUS
 address-family ipv4 unicast autonomous-system 100
  af-interface GigabitEthernet0/0
   delay 10
   bandwidth-percent 50
  exit-af-interface
```

## Verification

```text
show interfaces GigabitEthernet0/0 | include BW|DLY
show ip eigrp interfaces detail
show ip eigrp topology
show ip route
```

Lab: change only `bandwidth-percent`; confirm successor unchanged. Change `delay`; confirm successor moves.

## Risks

- Setting `bandwidth` for EIGRP TE and surprising other features that read the same value.
- Asymmetric delay tuning → unexpected return path.
- Lowering bandwidth-percent too far during convergence → RTP starvation / neighbor flaps.

## Interview framing

“For EIGRP TE I tune delay (and sometimes bandwidth) to move successors; `ip bandwidth-percent eigrp` only paces control traffic and does not change the composite metric.”

---
