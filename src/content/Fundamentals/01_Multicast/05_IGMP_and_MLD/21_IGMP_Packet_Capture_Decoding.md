# IGMP packet-capture decoding workflow

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Use this workflow on each packet rather than trusting the decoder's summary label.

## 1. Identify the link and direction

- Capture interface and VLAN.
- Ethernet source/destination.
- IPv4 source/destination.
- Which router or host sent the packet?

## 2. Validate the IPv4 envelope

- Protocol = 2.
- TTL = 1.
- Router Alert present for v2/v3.
- No unexpected fragmentation.

## 3. Identify the message/version

| Observation | Meaning |
|---|---|
| Type 0x12 | v1 Report |
| Type 0x16 | v2 Report |
| Type 0x17 | v2 Leave |
| Type 0x22 | v3 Report |
| Type 0x11, length 8, Max Resp = 0 | v1 Query |
| Type 0x11, length 8, Max Resp ≠ 0 | v2 Query |
| Type 0x11, length ≥ 12 | v3 Query |

A 10-byte type-0x11 Query is invalid; it is not “almost v3.”

## 4. Decode semantics

For Query:

- General, group-specific, or group-and-source-specific?
- Raw and decoded Max Resp value.
- S, QRV, QQIC.
- Source count and source list.

For v3 Report:

- Number of Group Records.
- For each record: record type, group, source count/list.
- Is it current state or state change?

## 5. Correlate the response

- Did reports arrive inside the maximum response window?
- Did an older query force compatibility reports?
- After a leave/block, did the querier send last-member queries?
- Did router/snooping state change?

## Useful Wireshark display filters

~~~text
igmp
igmp.type == 0x11
igmp.type == 0x22
ip.proto == 2
ip.dst == 224.0.0.22
~~~

Field names can vary by Wireshark release. Always inspect packet bytes and length when version identification matters.

