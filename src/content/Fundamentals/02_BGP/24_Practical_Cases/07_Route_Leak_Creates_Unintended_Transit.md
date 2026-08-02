# Case: Route Leak Creates Unintended Transit

## Symptom

A small edge AS receives a full table from provider A and advertises it to provider B. Traffic surges and links congest.

## Reasoning

Export policy failed to distinguish provider-learned routes from customer routes.

## Proof

Leaked advertisements retain tags showing provider-A ingress and appear in provider B's route view with the edge AS added.

## Correction

Withdraw the leak, enforce a relationship-based export matrix, set maximum-prefix limits, and deploy BGP Roles/OTC where supported.

## Lesson

RPKI can show these routes Valid because their origins remain legitimate. Leak prevention is relationship policy.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
