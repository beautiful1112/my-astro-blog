# Multi-Exit Discriminator (MED)

MED (Multi-Exit Discriminator, type code 4) suggests which **entry point** a neighboring AS should prefer when multiple links lead into the advertising AS. **Lower is normally better.** MED is optional and **non-transitive**—it is not meant to influence arbitrary distant networks.

## Comparison scope

By default on most platforms, MED is compared only among paths received from the **same neighboring AS**. Paths from different upstreams are not MED-compared unless **always-compare-med** (or equivalent) is enabled.

Earlier criteria still dominate: LOCAL_PREF and AS_PATH length typically win before MED is consulted. See [AS_PATH, ORIGIN, and MED Comparisons](../10_Best_Path/04_AS_PATH_ORIGIN_and_MED_Comparisons.md).

## Missing MED and determinism

| Knob / behavior | Why it matters |
|---|---|
| Missing MED as 0 vs “worst” | Changes which path wins when one side omits MED |
| deterministic-MED | Avoids session-order dependent results when MEDs from different ASes mix in the decision set |
| always-compare-med | Broadens comparison across neighboring ASes—can surprise operators |

Always document the platform’s missing-MED treatment for the AS.

## Configuration patterns

### Cisco IOS / IOS XE

```text
route-map SET-MED-PRIMARY permit 10
 set metric 100
route-map SET-MED-BACKUP permit 10
 set metric 200

router bgp 65000
 neighbor 192.0.2.1 remote-as 64496
 neighbor 192.0.2.1 route-map SET-MED-PRIMARY out
 neighbor 192.0.2.5 remote-as 64496
 neighbor 192.0.2.5 route-map SET-MED-BACKUP out
 ! Optional:
 bgp always-compare-med
 bgp deterministic-med
```

On Cisco, `set metric` in a BGP route-map sets MED.

### Junos

```text
set policy-options policy-statement MED-PRIMARY term 1 then metric 100
set policy-options policy-statement MED-PRIMARY term 1 then accept
set protocols bgp group ISP-A-PRIMARY export MED-PRIMARY
set protocols bgp path-selection always-compare-med
```

### FRRouting

```text
route-map SET-MED-PRIMARY permit 10
 set metric 100
!
router bgp 65000
 bgp deterministic-med
 neighbor 192.0.2.1 route-map SET-MED-PRIMARY out
```

## Interactions

| Mechanism | Interaction |
|---|---|
| LOCAL_PREF | Remote AS may set LOCAL_PREF and ignore your MED entirely |
| AIGP | Some designs translate AIGP→MED toward non-AIGP peers; avoid double-counting ([AIGP](11_AIGP.md)) |
| IGP cost | Hot-potato inside the **receiving** AS can override MED if LOCAL_PREF/AS_PATH already tied differently per router |
| Aggregation | MED of components may be lost or reset on aggregates |
| Multipath | MED equality is often required for eBGP ECMP |

## Verification

```text
show ip bgp 192.0.2.0/24
! Metric column = MED
show ip bgp neighbors 192.0.2.1 advertised-routes
show bgp ipv4 unicast 192.0.2.0/24
```

Coordinate with the neighboring AS: confirm they honor MED, do not overwrite it on import, and use the agreed primary/backup values.

## Risks

- Expecting MED to steer the whole Internet.
- Enabling always-compare-med without understanding cross-AS metric namespaces (your “100” vs their “100” are unrelated scales).
- Nondeterministic winners when deterministic-MED is off and paths from multiple ASes interleave.
- Setting MED inbound locally when the intent was outbound signaling (wrong direction).

## Interview framing

“MED is a non-transitive hint to an adjacent AS for multi-exit preference, lower better, usually compared only among paths from that same AS; LOCAL_PREF and AS_PATH still dominate.”

---
