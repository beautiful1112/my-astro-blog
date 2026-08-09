# Fast Failover vs Stability

The fastest timers are not automatically the safest design. Balance detection speed, false positives, alternate-path readiness, FIB programming time, flow rehash, and strategy behavior after loss.

## Design knobs

| Knob | Faster failover risk |
|---|---|
| Aggressive BFD | Flaps on microbursts / optic dirty; path oscillation |
| Low Hold Time without BFD | Slow relative to BFD; still session-killing |
| Performance-driven LOCAL_PREF | Oscillation unless hysteresis |
| Graceful Restart | May preserve stale forwarding ([GR risk](../25_Interview_Questions/09_Graceful_Restart_Risk.md)) |
| PIC / preinstalled backup | Best when backup is capacity-validated |

## Policy sketch for hysteresis

```text
! Prefer primary; only demote after sustained probe failure (external controller)
! Do not flap LP on single sample
route-map OUTBOUND-PRIMARY permit 10
 set local-preference 300
route-map OUTBOUND-BACKUP permit 10
 set local-preference 100
```

Combine BFD with PIC or preinstalled alternatives so detection is not wasted on cold RIB installs. Add damping or hold-downs to performance-driven policy.

## Decision matrix

| Environment | Lean toward |
|---|---|
| Clean dark fiber, PIC ready | Faster BFD + hard fail |
| Microwave / congested handoff | Slower detection + hysteresis |
| VIP with validated backup | Prefer backup install over GR stale |
| Bulk MD with buffer | Slightly slower OK if stable |

## Target metric

Maximum packet-loss interval under a defined failure—not merely “BGP reconverges fast.” Measure it ([Failover loss lab](../26_Labs/10_Failover_Loss_Measurement.md)). See also [Fast BFD oscillation case](../24_Practical_Cases/12_Fast_BFD_Causes_Path_Oscillation.md).

---
