# Eligibility Before Best-Path Selection

Best-path comparison starts only after a route is eligible. A path can be excluded because:

- Import policy rejected it.
- Its NLRI or attributes are invalid.
- The BGP next hop is unresolved.
- AS-loop detection found the local ASN.
- RPKI-origin policy rejected an Invalid route.
- A route-reflector loop attribute matched.
- A family, VRF, or capability is inactive.

Only eligible paths enter the meaningful decision set. Therefore “why did route B lose?” is sometimes the wrong question: route B may never have participated.

Troubleshoot in order: received, accepted, eligible, best, installed, and advertised.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
