# Case: More-Specific Hijack Beats Better Attributes

## Symptom

The legitimate 198.51.100.0/23 is BGP best, but traffic to 198.51.100.42 follows an unauthorized /24.

## Reasoning

Forwarding first performs longest-prefix match. Best-path attributes compare routes for the same NLRI; they do not make a /23 override a /24.

## Proof

The FIB contains both prefixes and selects 198.51.100.0/24 for the destination.

## Correction

Reject the unauthorized more-specific through prefix authorization and RPKI policy, then verify withdrawal and external visibility.

## Lesson

Longest-prefix match occurs in forwarding after BGP has selected a path for each prefix.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
