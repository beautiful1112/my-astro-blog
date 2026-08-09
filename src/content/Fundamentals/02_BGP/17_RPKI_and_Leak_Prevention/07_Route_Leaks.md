# BGP Route Leaks

RFC 7908 describes **route leaks** as propagation of routing announcements beyond their intended scope. A classic leak exports **provider- or peer-learned** routes to another **provider or peer**, making the leaking AS unintended transit.

## Classic pattern

```text
Customer-A → ISP-B → (leak) → ISP-C
ISP-C sends traffic to Customer-A via ISP-B who never sold transit to ISP-C
```

Origin ASN may remain correct → **RPKI Valid** while the path is still harmful.

## Consequences

- Traffic detours and congestion on an under-capacity AS.
- Packet loss and latency spikes.
- Policy / contractual violations.
- Apparent “hijack” symptoms with a legitimate origin.

## Why ROV is not enough

Origin validation answers authorization of the **origin**, not whether an intermediate AS was supposed to announce the path to you. Leaks need relationship-aware controls.

## Prevention toolkit

| Control | Role |
|---|---|
| Import/export policy by peer type | Customer / peer / transit tables |
| Communities (e.g. no-export, peer-only) | Signal intended scope |
| Max-prefix | Limit blast radius |
| BGP Roles + OTC | Protocol leak detection—[08](08_BGP_Roles_and_OTC.md) |
| Monitoring / BMP | Detect sudden path/count changes |
| Peering DB / IRR as-set | Build filters |

## Lab / detection ideas

- Tag routes by learn-type community at ingress; reject those communities on peer/transit export.
- Alert when a peer sends you prefixes whose AS_PATH suggests provider-transit roles.

## Interactions

| Mechanism | Relationship |
|---|---|
| **RPKI Valid** | May still leak |
| **as-override** | VPN tool—irrelevant to Internet leak semantics |
| **Graceful shutdown** | Unrelated planned-drain tool |

## Verification

```text
show bgp ipv4 unicast neighbors <peer> routes
! unexpected full table from a peer-peer session
show bgp ipv4 unicast regexp _64500_
```

## Interview framing

“A route leak announces routes beyond intended scope—often peer/provider routes to another peer/provider; origins can stay RPKI Valid, so you need relationship policy and OTC, not only ROV.”

---
