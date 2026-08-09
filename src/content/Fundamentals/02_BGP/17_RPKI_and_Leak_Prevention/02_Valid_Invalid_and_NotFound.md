# RPKI Origin-Validation States

For each BGP route, origin validation compares the **origin ASN** and **prefix length** against the VRP set.

## States

| State | Meaning |
|---|---|
| **Valid** | ≥1 covering VRP authorizes both origin ASN and length |
| **Invalid** | A covering VRP exists, but ASN or maxLength fails |
| **NotFound** | No VRP covers the route |

**NotFound** means “no validated authorization data,” **not** “malicious.”

## Worked examples

VRP: `203.0.113.0/24`, maxLength `/24`, ASN `64500`

| Route | State | Reason |
|---|---|---|
| `203.0.113.0/24` AS64500 | Valid | Exact match |
| `203.0.113.0/25` AS64500 | Invalid | Too specific vs maxLength |
| `203.0.113.0/24` AS64501 | Invalid | Wrong origin |
| `198.51.100.0/24` AS64500 | NotFound | No covering VRP |

Multiple VRPs may cover a prefix; Valid if **any** authorizing VRP matches.

## Covering logic

A VRP covers a route if the VRP prefix is equal or less specific and the route length ≤ maxLength. Longest/covering rules follow RFC 6811 / 8481 implementation behavior—verify platform edge cases for aggregates.

## Policy mapping (preview)

Common production stance:

- reject or depreference **Invalid**;
- accept **NotFound** with ordinary filters;
- prefer **Valid** only carefully (do not break customer→provider hierarchy).

Details in [04_Origin_Validation_Policy](04_Origin_Validation_Policy.md).

## Verification

```text
show bgp ipv4 unicast 203.0.113.0/24
! Origin validation: valid / invalid / not-found
show bgp rpki history
```

FRR: `show bgp ipv4 uni <pfx>` includes RPKI status when configured.

## Interactions

| Mechanism | Relationship |
|---|---|
| **Leaks** | Leaked Valid routes stay Valid—need OTC/policy |
| **RTBH /32** | May become Invalid if ROA maxLength is /24 |
| **AS sets** | Origin determination can be ambiguous—platform-specific |

## Interview framing

“Valid means a VRP authorizes the origin and length; Invalid means a VRP exists but mismatches; NotFound means no VRP—NotFound is not an automatic attack verdict.”

---
