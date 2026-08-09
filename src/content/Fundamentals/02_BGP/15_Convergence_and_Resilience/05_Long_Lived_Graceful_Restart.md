# Long-Lived Graceful Restart

**Long-Lived Graceful Restart (LLGR)** permits selected stale routes to remain usable **beyond** the ordinary GR stale-path interval. Stale status is signaled with well-known communities / capability bits so downstream speakers can depreference them.

## When LLGR helps

Long control-plane maintenance (software upgrade, prolonged RP recovery) when the **forwarding plane truly remains intact** and an alternate path is unavailable or worse. Helpers retain LLGR-stale routes with lower preference instead of flushing at classic GR expiry.

## When LLGR hurts

If forwarding is dead, LLGR **prolongs blackholes** dramatically—minutes to hours depending on configuration. Complete node failure, power loss, or silent fabric death are the danger cases.

## Capability and preference

| Element | Role |
|---|---|
| LLGR capability | Negotiated per family |
| LLGR_STALE community | Marks long-lived stale paths |
| Local preference policy | Typically lower than fresh paths |
| LLGR stale timer | Hard cap on retention |

Fresh paths should always beat LLGR-stale paths when both exist.

## Configuration sketch

### Cisco IOS XR (conceptual)

```text
router bgp 65000
 bgp graceful-restart
 bgp long-lived-graceful-restart
 address-family ipv4 unicast
  long-lived-graceful-restart stale-time 10000
```

### Junos

```text
set protocols bgp family inet unicast long-lived-graceful-restart restarter stale-time 10000
```

Exact knobs vary; treat vendor docs as authoritative.

## Design rules

- Enable only for families/peers with a proven NSF forwarding model.
- Cap stale time; never “infinite.”
- Apply lower preference to stale paths.
- Test **power-pull and transport failures**, not only `restart routing`.
- LLGR is continuity, **not** a substitute for redundant paths or ADD-PATH.

## Interactions

| Mechanism | Relationship |
|---|---|
| **Classic GR** | LLGR begins after GR stale handling |
| **Graceful shutdown** | Prefer planned drain before maintenance when possible |
| **RPKI / policy** | Stale paths still subject to validation if re-evaluated |
| **Maximum-prefix** | Stale set still consumes scale |

## Verification

```text
show bgp neighbors | include Long-lived
show bgp ipv4 unicast <prefix>
! community LLGR_STALE / stale flag / lower LOCAL_PREF
```

## Interview framing

“LLGR extends GR’s stale-route retention for long control-plane outages; it only helps when forwarding survives—and it can extend blackholes if that assumption is wrong.”

---
