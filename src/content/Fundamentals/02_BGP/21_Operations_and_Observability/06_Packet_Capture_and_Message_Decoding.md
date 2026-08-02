# Packet Capture and BGP Message Decoding

A capture can answer transport and protocol questions:

- Was TCP 179 reached?
- Which side opened the connection?
- Were MD5/AO or TTL protections involved?
- What Hold Time and capabilities were offered?
- Which AFI/SAFI was negotiated?
- Which attributes and NLRI appeared in an UPDATE?
- What NOTIFICATION code ended the session?

BGP messages are not encrypted by TCP MD5 or TCP-AO. Capture only under authorization and protect the files; they expose routing policy and topology.

For a reset, capture both directions and correlate packet time with router logs. A NOTIFICATION immediately followed by FIN/RST is much more informative than the final Idle state.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
