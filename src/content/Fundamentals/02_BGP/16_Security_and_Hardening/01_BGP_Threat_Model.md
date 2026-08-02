# BGP Threat Model

BGP security failures fall into several classes:

- Unauthorized session establishment or reset.
- False prefix origination.
- Manipulated AS paths or attributes.
- Route leaks caused by incorrect export policy.
- Resource exhaustion through route volume or churn.
- Control-plane denial of service.
- Compromise of configuration, automation, or routing registries.

No single feature solves all classes. TCP authentication protects the session, RPKI validates origin authorization, policy constrains relationships, maximum-prefix protects scale, and monitoring detects unexpected outcomes.

Build layered controls around explicit trust boundaries.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
