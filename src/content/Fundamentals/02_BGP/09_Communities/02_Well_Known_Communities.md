# Well-Known Communities

Certain standard community values are reserved with globally defined meanings. Do not invent colliding `ASN:value` uses for these numbers. Still: a community received but **never matched** by local policy has no effect—platform support and configuration matter.

## Core well-known values

| Name | Value (decimal) | Common meaning |
|---|---:|---|
| **NO_EXPORT** | 0xFFFFFF01 (65535:65281) | Do not advertise outside the receiving confederation / AS boundary as defined |
| **NO_ADVERTISE** | 0xFFFFFF02 (65535:65282) | Do not advertise to any BGP peer |
| **NO_EXPORT_SUBCONFED** | 0xFFFFFF03 (65535:65283) | Do not advertise to eBGP peers, including other member-ASes in a confederation |
| **NOPEER** | 0xFFFFFF04 (65535:65284) | Hint: do not advertise to bilateral peers (policy-dependent) |

Exact boundary behavior for NO_EXPORT vs confederation members is easy to get wrong—lab the platform before relying on it in production.

## BLACKHOLE (RFC 7999)

RFC 7999 defines the **BLACKHOLE** community for destination-based discard signaling. Deployments must combine it with:

- strict prefix authorization (only your space / customer space);
- next-hop or discard action that cannot be used for traffic diversion attacks;
- optional RTBH scoping (customer-triggered vs provider-triggered);
- rate limits and monitoring.

A bare BLACKHOLE tag without authorization is an attack surface, not a feature.

## Configuration patterns

### Cisco IOS / IOS XE

```text
route-map SET-NO-EXPORT permit 10
 match ip address prefix-list INTERNAL-ONLY
 set community no-export
!
router bgp 65000
 neighbor 10.0.0.2 send-community
 neighbor 10.0.0.2 route-map SET-NO-EXPORT out
```

Many platforms require explicit `send-community` (and `send-community extended` / large) or communities are not advertised.

### Junos

```text
set policy-options community NO-EXPORT members no-export
set policy-options policy-statement INTERNAL term 1 then community add NO-EXPORT
set policy-options policy-statement INTERNAL term 1 then accept
```

### FRRouting

```text
route-map SET-NO-EXPORT permit 10
 set community no-export
!
router bgp 65000
 neighbor 10.0.0.2 send-community
 neighbor 10.0.0.2 route-map SET-NO-EXPORT out
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Confederations | NO_EXPORT vs NO_EXPORT_SUBCONFED differ at member-AS borders |
| RTBH / FlowSpec | BLACKHOLE community vs FlowSpec redirect/drop—pick one ops model per use case |
| Import policy | Must honor well-known tags; default “accept all communities” is insufficient without actions |
| Route servers | Often strip or ignore customer-applied well-known tags per IX policy |

## Verification

```text
show ip bgp community no-export
show ip bgp 192.0.2.0/24
show bgp ipv4 unicast neighbors 10.0.0.2 advertised-routes
! Confirm NO_ADVERTISE paths are not re-advertised
```

Lab: tag NO_ADVERTISE on a path received from R1; confirm R2 does not advertise it further. Repeat for NO_EXPORT across an eBGP boundary.

## Risks

- Assuming the name alone enforces behavior without `send-community` / matching policy.
- Customer-sent BLACKHOLE covering someone else’s prefix.
- Using NO_EXPORT on routes that must reach external backups.
- Confusing NOPEER (hint) with mandatory filter enforcement.

## Interview framing

“Well-known communities like NO_EXPORT and NO_ADVERTISE have reserved meanings, but only configured policy and send-community behavior make them effective; BLACKHOLE requires strict authorization.”

---
