# Prefix, AS-Path, and First-AS Validation

External route acceptance should verify multiple dimensions:

- Prefix is authorized for the peer and within permitted lengths.
- Neighbor ASN appears first in AS_PATH when the relationship requires it.
- Local, private, reserved, or prohibited ASNs are absent where inappropriate.
- Path length is plausible.
- Origin validation state meets policy.

First-AS enforcement is often unsuitable on an Internet exchange route-server session because the route server may not prepend its own ASN. Use relationship-specific policy.

Syntactic validation cannot prove the entire path is genuine; it narrows the attack and error surface.

---

