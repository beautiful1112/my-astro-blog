# next-hop-unchanged

`next-hop-unchanged` (and related “propagate BGP next hop” options) preserve the received BGP NEXT_HOP when advertising a route to an eBGP peer, instead of rewriting NEXT_HOP to the local speaker. It is the deliberate opposite of the usual eBGP next-hop-self behavior on the external link.

## When the default rewrite is wrong

By default, an eBGP speaker advertising to an external neighbor sets NEXT_HOP to itself (the local interface address used for that session). That is correct when the peer should forward through you.

It is wrong when:

- You are an **IXP route server** that must not be in the data path; members must see each other’s next hops.
- You are a **route reflector for eBGP** / controller-style design that reflects third-party next hops.
- You operate a **seamless MPLS** or inter-AS Option C style design where the downstream peer must recurse to the original PE/loopback next hop over a labeled tunnel.
- You need **third-party next hop** on a shared LAN so traffic can go directly to another router on the same subnet.

## Relationship to next-hop-self

| Knob | Typical session | Effect |
|---|---|---|
| **next-hop-self** | iBGP (edge → core) | Rewrite NEXT_HOP to the advertising iBGP speaker so core routers need no external subnet in the IGP. |
| **Default eBGP** | eBGP | Rewrite NEXT_HOP to self on export. |
| **next-hop-unchanged** | eBGP (special) | Keep the previous NEXT_HOP when exporting. |
| **IGP advertisement of CE subnet** | alternative to next-hop-self | Leave external next hop intact inside the AS. |

Enabling unchanged next hop without ensuring the receiver can resolve that next hop blackholes traffic—the classic “route present, next hop unreachable” failure.

## Configuration patterns

### Cisco IOS XE (IPv4 unicast example)

```text
router bgp 65000
 neighbor 203.0.113.10 remote-as 65010
 address-family ipv4
  neighbor 203.0.113.10 next-hop-unchanged
 exit-address-family
```

For VPNv4 inter-AS designs, the knob often appears under the VPNv4 address family toward the remote PE/ASBR:

```text
 address-family vpnv4
  neighbor 198.51.100.2 next-hop-unchanged
```

### Junos

```text
set protocols bgp group RS export KEEP-NH
set policy-options policy-statement KEEP-NH then next-hop self
```

Junos commonly expresses next-hop behavior in **policy** (`then next-hop self` vs leaving next hop alone) rather than a single neighbor keyword. Route-server configurations explicitly avoid next-hop self.

### FRRouting

```text
router bgp 65000
 neighbor 203.0.113.10 remote-as 65010
 address-family ipv4 unicast
  neighbor 203.0.113.10 next-hop-unchanged
 exit-address-family
```

## Resolution requirements

The receiving AS must be able to recurse to the preserved next hop:

1. Directly connected LAN (third-party next hop), or
2. IGP/static reachability to that address, or
3. MPLS/SR tunnel to that BGP next hop (LU / RSVP / SR-MPLS).

If recursion fails, the path stays in BGP Loc-RIB (or is ineligible) and never becomes a usable FIB entry.

## Interactions

| Feature | Notes |
|---|---|
| **Route servers** | Essentially mandatory; combined with client-to-client reflection and sanitized communities. |
| **ADD-PATH** | Orthogonal; unchanged next hop can expose multiple exit points with different next hops. |
| **uRPF / ACLs** | Third-party next hop can change the expected incoming interface for return traffic. |
| **GTSM** | Still applies to the BGP session, not to the data-plane next hop. |

## Verification

```text
show bgp ipv4 unicast neighbors <peer> advertised-routes
show bgp ipv4 unicast <prefix>
! NEXT_HOP should be the original speaker, not the route-server/ASBR address
traceroute / show cef <prefix>
```

Fail the resolution path to the preserved next hop and confirm the BGP route becomes unusable—proving dependence on underlay reachability.

## Interview framing

“next-hop-unchanged keeps the original BGP next hop across an eBGP advertisement so the receiver can forward directly to that next hop; used for route servers and some inter-AS MPLS designs, and useless unless the next hop remains resolvable.”

---
