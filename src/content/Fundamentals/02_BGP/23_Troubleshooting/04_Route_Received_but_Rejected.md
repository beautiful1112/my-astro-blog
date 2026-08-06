# Route Received but Rejected

Inspect pre-policy route data, then evaluate every import term in order:

- Prefix and length.
- AS path and first ASN.
- Community.
- RPKI validation state.
- Next-hop or attribute validity.
- Peer role and family.
- Default action.

Policy languages often stop at the first terminating match. A broad reject term above the intended permit is a common cause.

Do not “fix” the symptom with permit-any. Prove the route is authorized and change the narrowest rule.

---

