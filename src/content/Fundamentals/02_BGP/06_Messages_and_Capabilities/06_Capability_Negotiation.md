# BGP capabilities

Capabilities are advertised in OPEN optional parameters. Important examples include:

- Multiprotocol extensions per AFI/SAFI;
- route refresh and enhanced refresh;
- four-octet ASN;
- graceful restart and long-lived graceful restart;
- ADD-PATH send/receive mode per family;
- extended messages;
- BGP roles.

Capabilities are directional where defined. ADD-PATH, for example, can be send, receive, or both. Inspect negotiated—not merely configured—capabilities.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
