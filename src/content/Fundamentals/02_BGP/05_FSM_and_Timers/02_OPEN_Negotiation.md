# OPEN negotiation

The OPEN message carries BGP version, sender ASN field, Hold Time, BGP Identifier, and optional parameters. Capabilities negotiate extensions such as MP-BGP families, route refresh, four-octet ASN, graceful restart, and ADD-PATH.

Capabilities are negotiated per session and sometimes per AFI/SAFI. Configuration may show an address family enabled locally while the peer did not advertise it; the TCP/BGP session can still be Established with that family inactive.

Unsupported or malformed parameters can trigger an OPEN Message Error and session closure.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
