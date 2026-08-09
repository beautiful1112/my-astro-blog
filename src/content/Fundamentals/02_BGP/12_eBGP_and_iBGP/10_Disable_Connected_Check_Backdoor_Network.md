# BGP Additional Advanced Knobs (disable-connected-check, backdoor, network route)

This note covers three frequently used but often undocumented “advanced” session and origination knobs that sit beside allowas-in / as-override / AIGP in real designs.

## disable-connected-check / multihop with TTL 1

eBGP normally requires the neighbor to be directly connected (TTL/hop limit 1 and connected-subnet checks). When peering between loopbacks on a directly connected link—or when the platform’s connected check blocks a valid one-hop session—you may need:

- `disable-connected-check` (Cisco), and/or
- `ebgp-multihop 1` / explicit TTL settings, and/or
- GTSM (`ttl-security`) with matching hop count.

These do **not** replace static/IGP routes to loopbacks for true multihop eBGP across intermediate routers—use multihop with a realistic TTL and recursive reachability for that case.

See also: [Direct and multihop eBGP](../04_Sessions_and_Transport/02_Direct_and_Multihop_eBGP.md), [GTSM](../16_Security_and_Hardening/03_GTSM_and_TTL_Protection.md).

### Cisco example

```text
router bgp 65000
 neighbor 192.0.2.1 remote-as 65001
 neighbor 192.0.2.1 update-source Loopback0
 neighbor 192.0.2.1 disable-connected-check
```

## backdoor

`network … backdoor` (Cisco) originates a prefix into BGP for advertisement to external peers while preferring the **IGP** path locally (administrative distance). Historically used when a prefix should be advertised to the Internet but the preferred site-internal path is IGP-learned from another edge.

Modern designs often replace backdoor with explicit LOCAL_PREF, conditional advertisement, or floating statics. If you still use it:

1. Document why BGP AD should lose to IGP for that prefix.
2. Confirm external advertisements still occur from the intended edge.
3. Lab failure of the IGP path and verify BGP becomes the local path without blackholing.

```text
router bgp 65000
 network 203.0.113.0 mask 255.255.255.0 backdoor
```

## `network` statement vs redistribution

| Method | Behavior |
|---|---|
| **network** statement | Advertises a prefix if an exact matching route exists in the local RIB (platform rules vary for IGP vs connected). |
| **redistribute** | Injects many routes; attribute seeding depends on route-map/policy. Easy to leak. |
| **aggregate-address** | Creates a summary; may suppress components (`summary-only`) and set ATOMIC_AGGREGATE. |

Interview-grade answer: prefer intentional `network` / aggregate with policy over broad redistribution for Internet edges; use redistribution inside controlled VRF/enterprise domains with strict route-maps.

## Interaction traps

- `network` for `203.0.113.0/24` does nothing if the RIB only has `203.0.113.0/25` (exact-match rule on many platforms).
- Redistributing BGP→IGP and IGP→BGP without filters creates feedback loops; tag routes.
- backdoor + redistribution of the same prefix yields confusing AD/ownership fights—pick one origination story.

## Verification

```text
show ip route 203.0.113.0
show bgp ipv4 unicast 203.0.113.0
show bgp ipv4 unicast neighbors <peer> advertised-routes
```

Confirm protocol ownership (O/B/S), AD, and that Adj-RIB-Out matches the design intent under primary and failure conditions.

---
