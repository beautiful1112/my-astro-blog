# Per-Family Activation and Policy

BGP transport and address-family exchange are separate layers. A neighbor can be Established while one AFI/SAFI has:

- Not been activated.
- Failed capability negotiation.
- No import/export policy.
- Zero permitted prefixes.
- A family-specific maximum-prefix shutdown.
- An unresolved next-hop format.

Operational output should be read per family: negotiated capability, received prefixes, accepted prefixes, advertised prefixes, and family-specific reset state.

This explains the common symptom “the BGP session is up, but no VPNv4/IPv6/EVPN routes are present.”

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
