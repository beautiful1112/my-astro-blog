# RPKI, ROAs, and VRPs

The Resource Public Key Infrastructure binds Internet number resources to a certificate hierarchy. A Route Origin Authorization (ROA) states that an ASN may originate prefixes under a specified resource, subject to a maximum length.

Relying-party software validates signed objects and produces **Validated ROA Payloads (VRPs)** containing prefix, maximum length, and origin ASN. Routers normally consume VRPs from local validator caches rather than performing certificate validation themselves.

RPKI origin validation answers “is this origin authorized by current validated data?” It does not validate every AS in the path or prove the data-plane path.

---

