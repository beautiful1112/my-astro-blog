# Packet Capture and BGP Message Decoding

A capture answers transport and wire-format questions that `show` commands cannot: collision races, capability mismatches, malformed UPDATEs, and exact attribute encoding (AIGP TLV, SoO, link-bandwidth).

## What to confirm

- TCP 179 reachability, SYN direction, and collision outcome.
- MD5 / TCP-AO option presence (capture still sees plaintext BGP above TCP).
- TTL / GTSM expectations on eBGP.
- OPEN: ASN (2/4-octet), Hold Time, BGP Identifier, capabilities (MP-BGP, refresh, GR, ADD-PATH, ORF, Extended Messages).
- UPDATE: path attributes, NLRI, withdrawn routes, communities / SoO / link-bandwidth / AIGP.
- NOTIFICATION code/subcode and whether FIN/RST followed.

## Practice workflow

```text
tcpdump -i eth0 -nn -s0 -w bgp.pcap 'tcp port 179'
# Wireshark: display filter bgp
# Expand Path Attributes; note optional non-transitive attrs
```

Correlate packet timestamps with syslog and BMP Peer Down. For “Established but empty,” decode OPEN capabilities and the first UPDATEs—family may not be activated, or every NLRI may be filtered after receipt.

## Attribute decoding tips

- **AIGP:** optional non-transitive; confirm presence only inside the trusted domain ([AIGP](../08_Path_Attributes/11_AIGP.md)).
- **SoO / link-bandwidth:** extended communities; verify type/value against config.
- **AS4_PATH / AS_PATH:** collision with `local-as` / `as-override` rewrites—compare wire vs Loc-RIB.

## Lab exercise

1. Bring up eBGP; capture OPEN capabilities (MP-BGP, refresh).
2. Change outbound policy; soft-clear; capture UPDATE vs route-refresh.
3. Misconfigure ASN; capture NOTIFICATION bad peer AS.
4. Enable AIGP in a trusted lab AS; confirm attribute appears only to AIGP peers.

## Safety

TCP MD5/AO does **not** encrypt BGP. Capture only under change-control authorization; treat PCAPs as sensitive topology and policy disclosure.

---
