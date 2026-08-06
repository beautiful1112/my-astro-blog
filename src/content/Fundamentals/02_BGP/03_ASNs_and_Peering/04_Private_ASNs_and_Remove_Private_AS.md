# Private ASNs and remove-private-AS

Private ASNs are useful in internal fabrics, customer sites, and confederation-like designs where global uniqueness is unnecessary. Internet-facing policy must prevent them from leaking.

`remove-private-AS` behavior varies: some modes remove only an all-private path, others remove all private occurrences or replace them with the local ASN. Mixed public/private paths and AS overrides require explicit testing.

Treat ASN translation as policy with loop-prevention consequences, not cosmetic cleanup.

---

