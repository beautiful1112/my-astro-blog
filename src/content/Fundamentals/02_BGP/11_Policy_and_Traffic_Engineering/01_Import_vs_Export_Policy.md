# Import vs Export Policy

**Import policy** decides what a neighbor is allowed to tell you and how accepted routes are classified. **Export policy** decides what you are willing to tell that neighbor and how advertisements are transformed.

Typical import actions:

- Permit or reject prefixes.
- Validate origin authorization.
- Set LOCAL_PREF.
- Add source and trust communities.
- Enforce maximum prefix counts.

Typical export actions:

- Permit only authorized local or customer routes.
- Prevent peer/provider transit.
- Add communities or prepends.
- Set MED.
- Aggregate or suppress specifics.

Write policy from an explicit default-deny posture. A session becoming Established should not automatically authorize route exchange.

---

