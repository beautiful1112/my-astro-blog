# Packet-capture interpretation

Captures prove what crossed a tap—not what the application processed. Align filters with the flow template and note timestamp source (NIC HW, kernel, capture tool).

## Useful filters

### Wireshark / tshark display

```text
igmp
pim
icmpv6.type == 130 || icmpv6.type == 131 || icmpv6.type == 132 || icmpv6.type == 143
ip.src == 192.0.2.10 && ip.dst == 232.10.10.10
udp.port == 15000
```

### tcpdump capture

```text
tcpdump -ni eth0 -vv -tt 'igmp'
tcpdump -ni eth0 -tt 'pim'
tcpdump -ni eth0 -tt -e 'udp and src host 192.0.2.10 and dst host 232.10.10.10'
tcpdump -ni eth0 'ip[6:2] & 0x1fff != 0'   # fragments
```

Check destination MAC mapping, VLAN tags, expected unicast source, remaining TTL, lengths/MTU, sequence boundaries, and timestamp source. On-host egress captures may show false bad checksums because hardware offload computes them later.

Related: [Ethernet mapping lab](../18_Labs/01_Ethernet_Mapping.md), [Wrong multicast MAC](../16_Practical_Cases/08_Wrong_Multicast_MAC.md), [Data from source](03_Data_From_Source.md).

## What to read on each frame

| Field | Why |
|---|---|
| Dest MAC | Mapping / flooding mistakes |
| VLAN | Wrong L2 segment |
| Src IP | SSM / spoof / wrong publisher |
| Dst IP | Group identity |
| TTL | Scope / path length |
| UDP length | Truncation / MTU |
| IGMP type/version | v2 vs v3 INCLUDE |
| PIM Join/Prune | Upstream neighbor, SGRPT bits |

## Configuration patterns (safe capture)

```text
# Prefer SPAN/TAP offbox under load
# Limit snaplen only when headers suffice; keep full frames for MTU proof
tcpdump -ni eth0 -s 0 -w /tmp/md-a.pcap 'udp and dst host 232.10.10.10'
tshark -r /tmp/md-a.pcap -T fields -e frame.time_epoch -e ip.src -e ip.dst -e udp.length
```

### Cisco SPAN sketch

```text
monitor session 1 source interface Gi0/1
monitor session 1 destination interface Gi0/2
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **Kernel bypass** | Host tcpdump may miss data |
| **GRO** | Aggregated frames confuse size analysis |
| **A/B** | Capture both lines with synced clocks |

## Verification checklist

- [ ] Filter matches intended `(S,G,port)`  
- [ ] MAC matches IP mapping expectation  
- [ ] No unexpected fragments  
- [ ] TTL consistent with hop count  
- [ ] IGMP/PIM decoded if control issue  
- [ ] Sequences correlated to app gaps  

## Risks

- Capturing on a CPU-starved host and concluding “network loss.”
- Display filters hiding fragments or VLAN-tagged frames.
- Acting on checksum errors from outbound offload.

## Interview framing

“Capture at the disputed boundary with tight `(S,G)` filters; validate MAC, VLAN, TTL, size, and sequences—and remember host captures can lie under offload or bypass.”

---
