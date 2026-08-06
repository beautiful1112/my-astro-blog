# Misconception: RPKI Valid Means Safe

Valid means the origin ASN and prefix length match at least one validated ROA payload.

It does not prove:

- Every AS_PATH hop is genuine.
- Export relationships are correct.
- The route is not leaked.
- The origin network is uncompromised.
- The forwarding path reaches the intended service.

Use Valid as one security signal inside layered policy, not as universal trust.

---

