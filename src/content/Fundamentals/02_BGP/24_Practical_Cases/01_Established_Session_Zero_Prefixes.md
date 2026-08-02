# Case: Established Session, Zero Prefixes

## Symptom

An eBGP peer has been Established for hours, but both accepted and advertised prefix counts are zero.

## Reasoning

Transport and OPEN negotiation work. The failure must be at family activation, origination, or policy.

## Proof

The IPv4-unicast capability is negotiated. The local BGP table contains the intended prefix, but outbound policy has no permit term and the platform follows default-reject behavior.

## Correction

Add an exact authorized-prefix permit, retain a reject default, request outbound policy re-evaluation, and verify the peer's received/accepted route.

## Lesson

Session state and route exchange are separate. Never solve this by adding permit-any.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
