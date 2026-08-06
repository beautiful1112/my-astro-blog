# Community-Based Policy Design

A maintainable community design separates observation from action:

1. Import policy classifies the route and adds informational tags.
2. A central policy translates approved action tags into LOCAL_PREF, export scope, prepend count, or blackholing.
3. Export policy preserves, transforms, or strips tags according to trust boundaries.

Design rules:

- Define who may set each tag.
- Reject dangerous action communities from unauthorized peers.
- Keep informational and action namespaces distinct.
- Record the policy reason as well as the outcome.
- Test missing, duplicated, and conflicting tags.

For a trading firm, tags can express exchange region, carrier, circuit class, DDoS action, and maintenance state. This makes policy auditable during fast incident response.

---

