# BGP Color-Aware Routing

**BGP Color-Aware Routing (CAR)** distributes transport routes keyed by **endpoint + intent/color** across domains. Colored service routes resolve recursively onto matching transport. **RFC 9871** (Experimental, Nov 2025) defines CAR SAFI **83**, VPN CAR SAFI **84**, NLRI types, and resolution behavior.

## Intent

| Element | Role |
|---|---|
| Color | Operator intent (low-delay, avoid-resource, …) |
| Endpoint | Egress PE / service loopback |
| Transport payload | MPLS stack, SR-MPLS index, or SRv6 SIDs |
| Service route | Resolves via color-aware NH |

Every color domain must **maintain or translate** color meaning—color `100` = low delay only if all domains agree.

## Resolution sketch

```text
VPN/service prefix → color-aware next hop (endpoint, color)
                 → CAR transport route
                 → segment list / labels in FIB
```

Related to SR Policy steering but standardized as CAR transport distribution.

## Status caution

RFC 9871 is **Experimental**. Treat implementation support and interoperability as an advanced design topic, **not** a universal BGP baseline. Prefer production-proven SR Policy / RSVP-TE where CAR support is immature.

## Interactions

| Mechanism | Relationship |
|---|---|
| **SR Policy** | [03](03_BGP_SR_Policy.md) overlapping intent model |
| **AIGP** | Metric accumulation alternative—[AIGP](../08_Path_Attributes/11_AIGP.md) |
| **LU / seamless MPLS** | Classic transport stitching |

## Verification (when implemented)

```text
show bgp car …
show route resolution color …
```

Commands are highly platform-specific.

## Interview framing

“CAR advertises colored transport to endpoints so services can recursively resolve by intent; it is experimental—know the idea and SR Policy relationship, not every SAFI detail by rote.”

## Operator pitfalls

- Reusing color IDs with different intent across AS boundaries without translation.
- Coloring service routes that have no matching CAR transport (blackhole on resolve).
- Assuming CAR replaces RSVP-TE/SR Policy ops maturity overnight.
- Leaking CAR SAFIs to peers that do not understand them.

## Minimal mental checklist

1. Service route has color X.
2. Local TED/RIB has CAR route to endpoint with color X.
3. Encapsulation programmed (MPLS/SRv6).
4. Underlay reaches first hop of the segment list.
5. Fallback policy defined when color transport disappears.

---
