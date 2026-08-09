# BGPsec Scope and Limits

**BGPsec** (RFC 8205 and related) adds cryptographic signatures intended to validate the **sequence of AS-path propagation**. It addresses a broader integrity problem than RPKI origin validation alone.

## What BGPsec aims to prove

That each AS in the AS_PATH authorized advertisement of the prefix **to the next AS** in a cryptographically verifiable way (subject to deployment assumptions and algorithm suites).

## What it does not automatically do

| Not covered | Needed instead / as well |
|---|---|
| Commercial export relationships (valley-free) | BGP Roles/OTC, communities, policy |
| Every route leak pattern | Export filters + OTC |
| Data-plane path proof | Forwarding validation / measurements |
| Partial deployment miracles | Signatures only as far as adoption reaches |

## Deployment barriers

- Protocol and hardware support for signature generation/verification at UPDATE rates.
- Key management for AS routers.
- Incremental adoption and compatibility with unsigned path segments.
- Operational complexity vs benefit while ROV + OTC still have runway.

## Interview distinction (memorize)

| Control | Problem class |
|---|---|
| **RPKI / ROV** | Origin authorization (deployed widely) |
| **BGPsec** | Path signature mechanism (limited deployment) |
| **BGP Roles / OTC** | Relationship-based leak detection |
| **IRR + prefix filters** | Contractual/registry allow-lists |

These controls are **complementary**, not substitutes.

## Interactions

| Mechanism | Relationship |
|---|---|
| **ROAs / VRPs** | BGPsec still relies on origin attestations in the broader RPKI ecosystem |
| **OTC** | Policy leak detection without crypto |
| **TCP-AO** | Protects session, not path content semantics |

## Practical stance

For most operators today: enforce ROV, deploy Roles/OTC where peers support it, keep strict export policy—and track BGPsec as future path integrity, not current day-2 ops dependency.

## Interview framing

“BGPsec signs AS-path propagation to go beyond origin validation, but it does not replace leak policy or prove forwarding; ROV + OTC + filters are the currently practical stack.”

## Where BGPsec would sit in a stack

```text
TCP-AO / GTSM     → protect the session
Prefix filters    → contractual allow-list
ROV (RPKI)        → origin ASN/length authorization
BGPsec            → cryptographic AS-path propagation (rare)
Roles / OTC       → relationship leak detection
Export policy     → do not become accidental transit
```

Skipping export policy because “we will do BGPsec someday” is not a plan.

## Verification reality

Most production looking glasses will not show BGPsec signatures today. Interview answers should emphasize **deployment status**, not pretend universal adoption.

---
