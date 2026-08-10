# Bandwidth percent and pacing

EIGRP paces its packets so a chatty control plane does not saturate a low-speed WAN link. Two related knobs: interface **bandwidth** (also feeds metric) and **`ip bandwidth-percent eigrp`**.

## Defaults

| Knob | Typical default | Meaning |
|---|---|---|
| Interface `bandwidth` | Platform/media default | Metric + pacing baseline (kbps) |
| `ip bandwidth-percent eigrp ASN` | **50%** | Max portion of configured bandwidth EIGRP may consume |

Pacing uses the configured bandwidth, **not** the physical line rate if they differ. Mis-set `bandwidth` therefore skews both metrics and pacing.

## Configuration

```text
interface Serial0/0
 bandwidth 256
 delay 1000
 ip bandwidth-percent eigrp 100 40
```

Named mode:

```text
router eigrp WAN
 address-family ipv4 unicast autonomous-system 100
  af-interface Tunnel0
   bandwidth-percent 30
  exit-af-interface
```

## Hello pacing under congestion

If the link is congested with data traffic and EIGRP is capped too aggressively (or bandwidth is understated), hellos may be delayed → neighbor flaps → queries → worse congestion.

| Situation | Guidance |
|---|---|
| Low-speed serial | Keep percent moderate; QoS priority for EIGRP/hellos |
| Tunnel with wrong BW | Fix `bandwidth` first |
| Flaps under load | Check CoS/QoS; raise percent carefully; protect proto 88 |

## Interaction with metrics

Raising `bandwidth` for pacing also **lowers** EIGRP metric (K1). Prefer:

1. Set `bandwidth` and `delay` for correct topology preference.
2. Use QoS to protect control plane.
3. Adjust `bandwidth-percent` for pacing only.

Do not “fix flaps” by inventing fake bandwidth without understanding metric side effects ([Bandwidth Mis-set](../21_Practical_Cases/08_Bandwidth_Mis-set_Metric_Explosion.md)).

## Verification

```text
show ip eigrp interfaces detail
! Peer Count, Hello/Pacing timers, bandwidth percent
show interface Serial0/0 | include BW|Dly
show ip eigrp traffic
```

## Risks

- `bandwidth 9` leftovers on tunnels.
- 50% of a falsely huge BW → EIGRP bursts more than the physical link allows.
- Chasing flaps with percent while QoS drops hellos.

## Interview framing

“EIGRP may use up to bandwidth-percent of configured interface bandwidth for pacing—wrong bandwidth breaks metrics and pacing together.”

## Related

- [WAN Design Challenges](01_WAN_Design_Challenges.md)
- [Unexpected Metrics](../20_Troubleshooting/07_Unexpected_Metrics.md)
- [Bandwidth Mis-set Metric Explosion](../21_Practical_Cases/08_Bandwidth_Mis-set_Metric_Explosion.md)

---
