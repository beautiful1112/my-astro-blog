# RFC 7868 and Specs

## Primary

- [RFC 7868 — Cisco’s Enhanced Interior Gateway Routing Protocol (EIGRP)](https://www.rfc-editor.org/rfc/rfc7868) — informational publication of EIGRP behavior (packets, TLV structure, DUAL overview, metrics). Start here for wire-level study beyond CLI guides.

## Related / context

- Treat vendor docs as normative for **Cisco CLI defaults** (AD, Hello/Hold profiles, named mode) even when RFC 7868 describes protocol mechanics.
- Multicast all-EIGRP-routers: IPv4 `224.0.0.10`, IPv6 `FF02::A`; IP protocol 88.
- RTP reliable transport semantics as described in RFC 7868 / Cisco architecture docs.

## How to read RFC 7868

1. Packet types and neighbor formation.  
2. Metric TLVs (classic vs wide).  
3. DUAL / FC sections—pair with Module 08 labs.  
4. Stub and summary behaviors—pair with Modules 09–11.

## Note on “open”

RFC 7868 made the protocol specification publicly readable; multi-vendor implementation remains limited compared to OSPF/IS-IS. Interview framing: know the RFC exists; expect Cisco-centric ops questions.

---
