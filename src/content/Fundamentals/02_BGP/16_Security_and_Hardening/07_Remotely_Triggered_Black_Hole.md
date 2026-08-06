# Remotely Triggered Black Hole

RTBH uses a BGP signal—often the RFC 7999 BLACKHOLE community—to install destination discard forwarding near network ingress during a DDoS attack.

Safety controls:

- Accept only authorized host or narrowly scoped prefixes.
- Verify the advertised prefix belongs to the customer or organization.
- Restrict who may attach the action community.
- Set NO_EXPORT or another defined scope when appropriate.
- Log, expire, and audit activations.
- Prefer a discard next hop or explicit hardware action.

RTBH preserves surrounding infrastructure by sacrificing reachability to the attacked destination. It is fast and blunt; FlowSpec can express more selective actions.

---

