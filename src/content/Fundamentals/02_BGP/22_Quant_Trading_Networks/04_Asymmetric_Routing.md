# Asymmetric Routing in Trading Networks

BGP independently selects the forward and reverse directions, so asymmetric routing is normal.

It becomes harmful when:

- Stateful firewalls see only one direction.
- One path has materially higher latency.
- ACL/uRPF policy rejects the return flow.
- Troubleshooting observes only one side.
- NAT state exists on the wrong edge.

Measure both directions from relevant endpoints. Use LOCAL_PREF for outbound control and advertisements/provider communities for inbound influence, recognizing that remote policy decides.

Avoid forcing symmetry unless the application or security architecture actually requires it.

---

