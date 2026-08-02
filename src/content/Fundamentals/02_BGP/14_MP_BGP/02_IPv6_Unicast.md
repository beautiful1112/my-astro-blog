# IPv6 Unicast over MP-BGP

IPv6 unicast uses MP_REACH_NLRI and MP_UNREACH_NLRI rather than the classic IPv4 NLRI fields. The next hop can include a global IPv6 address and, in some contexts, a link-local address.

Operational checks:

- IPv6 unicast capability is negotiated in both directions.
- Import and export policy exists for IPv6.
- The next hop resolves in the correct table.
- IPv6 prefix-length filters are independent of IPv4.
- Router IDs remain 32-bit values even in an IPv6-only transport design.

Dual-stack peers may use one or separate transport sessions depending on platform and design. Never infer IPv6 route exchange merely because the IPv4 family works.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
