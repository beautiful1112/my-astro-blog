# Standard Communities

A standard BGP community is a 32-bit tag conventionally displayed as **ASN:value**. Communities let one policy attach meaning and another policy act on it without repeatedly matching large prefix or AS-path lists.

Common uses include:

- Marking customer, peer, or provider routes.
- Encoding geographic ingress.
- Requesting provider actions such as local preference or selective prepending.
- Tagging blackhole candidates.
- Preserving the reason a route received a preference.

Communities do nothing by themselves. Their effect comes from policy, so both sides must agree on semantics. Standard communities are optional transitive, but an export policy may intentionally remove them.

Treat the community catalog as an API: document ownership, direction, permitted values, and action.

---

