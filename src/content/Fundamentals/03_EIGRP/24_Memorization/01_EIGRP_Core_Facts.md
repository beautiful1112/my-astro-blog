# EIGRP Core Facts to Memorize

- Protocol: **IP protocol 88** (not TCP/UDP).
- IPv4 multicast: **224.0.0.10**; IPv6: **FF02::A**.
- Cisco AD: **internal 90 / external 170 / summary 5**.
- Transport: **RTP** (reliable sequenced delivery for Updates/Queries/Replies; Hellos typically unreliable).
- Neighbor must-match: **AS**, **K-values**, subnet/AF compatibility, **auth** if used.
- Hello/Hold defaults (common Cisco): LAN **5 / 15**; many WAN/NBMA **60 / 180**. Hold comes from neighbor’s Hello.
- Default K-values: **K1=1, K2=0, K3=1, K4=0, K5=0** → bandwidth + delay.
- Classic metric uses min path bandwidth + cumulative delay (scaled); wide metrics for high-speed differentiation.
- Tables: **neighbor**, **topology**, **routing (RIB)**.
- RFC: informational **RFC 7868** (EIGRP); historically Cisco proprietary.
- Stub: query boundary + limited advertisements; still receives routes by default.
- Variance: UCMP only for paths that pass **FC**; does not override DUAL.
- Named mode: CLI hierarchy (AF / af-interface / topology)—same wire protocol.
- IPv6: needs **32-bit RID**; classic IPv6 process often **shutdown** until enabled.
- Split horizon matters on NBMA/multipoint hub-and-spoke.
- Pacing: `ip bandwidth-percent eigrp` ≠ metric `bandwidth`.

## Quick AD comparison anchors

| Source | Typical Cisco AD |
|---|---|
| Connected | 0 |
| Static | 1 |
| EIGRP summary | 5 |
| eBGP | 20 |
| EIGRP internal | 90 |
| OSPF | 110 |
| IS-IS | 115 |
| RIP | 120 |
| EIGRP external | 170 |
| iBGP | 200 |

---
