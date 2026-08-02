# Lab: RPKI Origin Validation

## Objectives

- Load controlled VRPs into a lab validator/cache.
- Produce Valid, Invalid, and NotFound paths.
- Test policy and validator failure.

## Tasks

1. Create one authorized prefix/origin/maxLength tuple.
2. Advertise exact authorized NLRI: expect Valid.
3. Advertise a too-specific NLRI: expect Invalid.
4. Advertise unrelated space: expect NotFound.
5. Change only the origin ASN: expect Invalid.
6. Apply reject-Invalid policy and inspect route counters.
7. Disconnect all caches and observe configured stale/expiry behavior.

Never point a production router at fabricated trust data.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
