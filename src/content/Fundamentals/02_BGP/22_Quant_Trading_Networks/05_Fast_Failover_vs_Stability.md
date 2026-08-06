# Fast Failover vs Stability

The fastest timers are not automatically the safest design. A low-latency environment must balance:

- Detection speed.
- False positives.
- Alternate-path readiness.
- Route-update and FIB programming time.
- Flow rehashing.
- Session and strategy behavior after loss.

Use BFD or fast physical signaling only when the platform and path can sustain it. Combine with PIC or preinstalled alternatives. Add damping or hysteresis to performance-driven policy so transient jitter does not cause path oscillation.

The target metric is maximum packet-loss interval under a defined failure, not merely “BGP reconverges fast.”

---

