# Conditional Advertisement

Conditional advertisement announces a prefix to a peer **only when** another prefix exists (or does not exist) in the local BGP table. Classic Cisco form uses `advertise-map` with `exist-map` / `non-exist-map`. It is a control-plane gating tool for backups, anycast shifts, and “advertise default only if upstream is healthy” designs.

## Core idea

```text
Advertise prefix P to neighbor N
  IF   (exist-map matches at least one prefix)      → advertise
  OR IF (non-exist-map matches zero prefixes)       → advertise
  ELSE                                             → withdraw / do not advertise
```

The condition is evaluated continuously as BGP table contents change; when the condition flips, BGP advertises or withdraws accordingly (subject to MRAI / update pacing).

## Common use cases

| Design | Condition |
|---|---|
| **Backup default** | Advertise default to customers only while a more-specific upstream default/default-ish prefix exists. |
| **Primary/backup WAN** | Site advertises its prefix to ISP-B only when the ISP-A learned route disappears. |
| **Anycast / service drain** | Stop advertising the service prefix when a health-injected “watcher” prefix vanishes. |
| **Avoid transit accidental** | Advertise customer cone to a peer only while an explicit “customer attached” marker route exists. |

Conditional advertisement is **not** BFD and **not** an IGP metric. It reacts to BGP RIB contents, so detection speed tracks BGP convergence of the watched prefix.

## Configuration pattern (Cisco-style)

```text
ip prefix-list WATCH-UPSTREAM permit 0.0.0.0/0
ip prefix-list OFFER-DEFAULT permit 0.0.0.0/0
!
route-map EXIST-UPSTREAM permit 10
 match ip address prefix-list WATCH-UPSTREAM
!
route-map ADV-DEFAULT permit 10
 match ip address prefix-list OFFER-DEFAULT
!
router bgp 65001
 neighbor 192.0.2.1 remote-as 65002
 address-family ipv4
  neighbor 192.0.2.1 advertise-map ADV-DEFAULT exist-map EXIST-UPSTREAM
 exit-address-family
```

Semantics: advertise prefixes matched by `ADV-DEFAULT` to the neighbor only while something matched by `EXIST-UPSTREAM` is present in the local BGP table.

`non-exist-map` inverts the condition—useful for “advertise to backup ISP only when primary path is gone.”

## Junos analogue

Junos typically expresses the same intent with **conditional route advertisement in policy** (e.g., `if-route-exists` / rib-group or policy conditions) or event policies, rather than Cisco’s advertise-map pair. Translate the intent—not the keyword—when crossing vendors.

## Interactions

| Feature | Notes |
|---|---|
| **LOCAL_PREF / MED** | Condition controls *whether* you advertise; attributes still control *how* the advertisement looks. |
| **Aggregation** | Watch the exact prefix you intend; an aggregate may exist after specifics disappear and keep a condition true unexpectedly. |
| **RPKI Invalid** | If the watched prefix becomes Invalid and is rejected, the condition can flip and withdraw the gated advertisement—usually desirable. |
| **Graceful Restart** | Stale watched prefixes can keep a condition true during GR and delay backup activation. |
| **Route reflection** | Condition uses the local BGP table; RR path hiding can remove the watched path from a client unexpectedly. |

## Verification

```text
show bgp ipv4 unicast neighbors 192.0.2.1 advertised-routes
show route-map ADV-DEFAULT
```

Procedure:

1. With upstream prefix present: gated prefix advertised.
2. Withdraw upstream prefix: gated prefix withdrawn to the neighbor.
3. Restore upstream: gated prefix returns after BGP update timers.
4. Measure time from upstream loss → backup advertisement; compare to SLO.

## Risks

- Watching the wrong prefix (e.g., a locally originated copy that never disappears) leaves the condition permanently true.
- Overlapping defaults from two upstreams can keep `exist-map` true when you intended failover.
- Operators confuse conditional advertisement with conditional **installation** into the RIB; this feature gates Adj-RIB-Out only.

## Interview framing

“Conditional advertisement uses exist/non-exist maps so a prefix is announced only while another BGP prefix is present or absent—useful for backup defaults and health-gated anycast, with failover timing bound by BGP convergence of the watched route.”

---
