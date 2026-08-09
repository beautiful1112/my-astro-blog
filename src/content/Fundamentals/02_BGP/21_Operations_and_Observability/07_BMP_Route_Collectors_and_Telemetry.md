# BMP, Route Collectors, and Telemetry

Three observation models answer different questions; none alone is a complete source of truth.

| Model | Sees | Blind spots |
|---|---|---|
| **BMP** (RFC 7854) | Per-peer Adj-RIB-In/Out (and Loc-RIB on some platforms), peer up/down | Depends on router BMP config; may omit filtered views |
| **Route collector** | What *you* advertise to the collector peer | Not what production peers receive; policy toward collector may differ |
| **Streaming telemetry / SNMP / logs** | Counters, FSM, CPU, queue, FIB events | Weak historical NLRI unless paired with BMP/collector |

## Operational use

1. **BMP** for “what did peer X send before import?” and historical path changes—including withdrawals that never became best.
2. **Collector / looking glass** for external visibility of your advertisements (prepend effects, community stripping).
3. **Telemetry** for session flaps, prefix-count cliffs, slow-peer, RPKI cache health, and FIB install lag.

## Context required for useful history

Preserve clock sync and identifiers: router, peer IP, VRF, AFI/SAFI, RD, path-id (ADD-PATH). Without them, multipath and VPN histories collide in the warehouse.

## Advanced topics in monitoring

Monitor policy-sensitive attributes on VIP prefixes: LOCAL_PREF, AIGP, SoO presence, link-bandwidth, and conditional-advertisement trigger routes. A silent loss of AIGP or bandwidth community can flip exits without a session flap.

## Practical architecture sketch

```text
Production edge  --BMP-->  collector farm  -->  warehouse / UI
Production edge  --eBGP--> looking-glass (restricted export)
Telemetry streams counters/FSM to same warehouse (join on router+peer+time)
```

Alerting joins NLRI history (BMP) with loss/latency SLIs so “best path unchanged” can still page on blackhole.

## Pitfalls

- Collector policy differs from production peers → false comfort on advertisements.
- BMP post-policy vs pre-policy mode misunderstood during an incident.
- Clock skew > 1s destroys flap correlation across devices.

Cross-link: [BMP](../20_Advanced_Families/05_BMP.md).

---
