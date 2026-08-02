# Inter-VRF Route Leaking

Inter-VRF leaking deliberately imports routes between otherwise isolated routing tables. Common patterns use route targets, selective policy, or a shared-services VRF.

Risks:

- Accidental full connectivity.
- Asymmetric reachability.
- Route feedback loops.
- Security controls bypassed by an unexpected return path.
- Overlapping address ambiguity.

Define exact allowed prefixes and both directions. A forward route without a return route is not working connectivity, while a broad return default may leak more access than intended.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
