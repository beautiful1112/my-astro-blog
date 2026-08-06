# Multicast security controls

- Prefer SSM and allowlist `(S,G)` tuples.
- Validate source addresses and block unauthorized multicast senders.
- Apply group/source boundaries and ACLs between zones.
- Restrict ports allowed to source data or control messages.
- Protect the control plane without starving legitimate convergence.
- Authenticate/protect PIM where justified and supported.
- Protect MSDP TCP sessions and filter SA ranges.
- Encrypt at application or tunnel layer when confidentiality is required.
- Monitor new `(S,G)` state, unexpected joins, RP changes, and fan-out.

