# RPKI, ROAs, and VRPs

The **Resource Public Key Infrastructure (RPKI)** binds Internet number resources to a certificate hierarchy rooted in RIRs. A **Route Origin Authorization (ROA)** states that an ASN may originate one or more prefixes under a specified resource, subject to a **maximum length**.

## Pipeline

```text
RIR certs → ROA signed objects in repositories
        → Relying-party validator fetches + cryptographically validates
        → Validated ROA Payloads (VRPs): {prefix, maxLength, origin ASN}
        → RTR to routers
        → Origin validation state on BGP routes
```

Routers normally consume **VRPs** from local caches rather than performing full certificate validation themselves.

## ROA contents

| Field | Meaning |
|---|---|
| Prefix | Authorized covering prefix |
| maxLength | Most-specific length allowed |
| Origin ASN | ASN authorized to originate |

Example: ROA `203.0.113.0/24-24 AS64500` authorizes only exact `/24` from AS64500.

## What RPKI answers

“Is this **origin ASN** authorized by current validated data for this prefix length?”

It does **not**:

- validate every AS in the path (that is closer to BGPsec);
- prove the data-plane path;
- detect all route leaks (origin may still be Valid);
- replace IRR or contractual filters.

## Operator duties

- Publish ROAs that match real announcements.
- Monitor ROA expiry and TAL/repository reachability.
- Prefer least-permissive maxLength—see [05](05_ROA_MaxLength_Risks.md).

## Verification (validator)

```text
rpki-client -j | head
# or Routinator / OctoRPKI VRP dump
# router: show bgp rpki table / show rpki prefix-table
```

## Interview framing

“RPKI uses signed ROAs to produce VRPs that authorize which ASN may originate which prefix lengths; routers use VRPs for origin validation, not full path proof.”

## Operational lifecycle

1. Inventory announced prefixes and origins.
2. Create ROAs with correct maxLength.
3. Wait for VRP visibility in public validators / your cache.
4. Announce (or keep announcing) matching BGP routes.
5. Monitor expiry; renew before NotFound/Invalid surprises.
6. On ASN or prefix renumbering, dual-cover then remove old ROAs.

## Commands (router side after RTR)

```text
show bgp rpki table
show bgp ipv4 unicast 203.0.113.0/24
! Origin RPKI validation state
```

---
