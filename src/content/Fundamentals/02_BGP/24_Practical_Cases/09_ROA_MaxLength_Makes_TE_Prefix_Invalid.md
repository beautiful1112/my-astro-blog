# Case: ROA maxLength Invalidates a TE Prefix

## Symptom

A newly advertised /24 is rejected by ROV-enabled networks, while its covering /22 remains reachable.

## Reasoning

The ROA authorizes the ASN for the /22 with maxLength /22. The /24 is therefore Invalid even though the origin ASN matches.

## Proof

Validator output shows a covering VRP, matching ASN, and failing prefix-length condition.

## Correction

Publish a least-permissive ROA that authorizes the planned /24, wait for validation propagation, confirm Valid state, and only then rely on the advertisement.

## Lesson

Origin validation checks both ASN and maximum length.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
