# Outbound vs Inbound Traffic Engineering

Outbound traffic is under stronger local control:

- LOCAL_PREF selects preferred exits.
- Policy and IGP cost choose among next hops.
- More-specific internal policy can steer selected destinations.

Inbound traffic requires influencing other autonomous systems:

- Advertise or suppress more-specific prefixes.
- Prepend AS_PATH selectively.
- Send provider-defined communities.
- Set MED for cooperating adjacent networks.
- Use different advertisements at different interconnects.

Remote policy remains authoritative. Validate from outside and consider the return path separately.

For trading flows, avoid destabilizing global routing to solve a local latency problem. Private interconnects and explicit provider communities are often more predictable.

---

