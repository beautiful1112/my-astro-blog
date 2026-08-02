# Origin-Validation Policy

A common policy is:

- Prefer or accept Valid.
- Continue accepting NotFound with normal policy.
- Reject or strongly deprefer Invalid.

The exact rollout depends on risk and reachability goals. Begin with visibility, verify validator health, identify legitimate Invalids, coordinate corrections, then enforce.

Do not set high LOCAL_PREF on Valid routes in a way that overrides relationship policy and attracts traffic through a provider instead of a customer. Origin state should constrain legitimacy, not accidentally rewrite the commercial hierarchy.

Define behavior when validator sessions fail and test cache expiry.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
