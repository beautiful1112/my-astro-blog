# Extended Communities

Extended communities are eight-octet values with typed structure. Their type field allows applications to distinguish semantics and whether the value is transitive.

Major uses:

- MPLS L3VPN and EVPN route targets.
- Site-of-Origin loop prevention.
- FlowSpec traffic actions.
- EVPN encapsulation and mobility metadata.

Some formats carry a two-octet ASN plus four-byte local value; others carry an IPv4 address or four-octet ASN with a smaller local value. Choose a format that can represent the required administrator field.

An extended community is a policy attribute. It is not automatically a VPN identifier or import instruction unless the relevant address family and policy interpret it that way.

---

