# Safe multicast testing tools

Test with sequenced, identifiable traffic and synchronized observation points. An unsequenced generator cannot prove absence of loss.

Useful tools:

- sequenced purpose-built sender/receiver;
- `iperf` UDP where the installed version supports multicast;
- `socat` or small socket programs for joins;
- captures at source, first hop, last hop, and receiver;
- `mtrace2` where supported;
- group-state and hardware-replication telemetry.

Related: [Python lab](../11_Host_and_Application/03_Python_Lab_Receiver_and_Sender.md), [Packet capture](../15_Troubleshooting/05_Packet_Capture.md), [Host bottleneck lab](../18_Labs/07_Host_Bottleneck.md).

## Tool roles

| Tool | Good for | Limit |
|---|---|---|
| Custom sequenced sender | Loss/latency proof | You maintain it |
| Python/`socat` join | Membership/signaling labs | Not line-rate |
| `iperf` multicast | Rough pps/Mbps | Check build options; sequencing weak |
| `tcpdump`/`tshark` | Ground truth at a tap | Host capture overhead |
| `mtrace2` | Path tracing where deployed | Spotty support |
| Device `show` counters | OIL/RPF confirmation | Not app correctness |

## Configuration patterns

### Minimal sequenced sender (concept)

```text
# Each datagram: session_id | seq | payload
# Log send monotonic time; receiver logs seq gaps
sendto 232.10.10.10:15000 from 192.0.2.10 TTL 16
```

### socat receiver join (ASM sketch)

```text
socat -u \
  UDP4-RECVFROM:15000,ip-add-membership=239.10.10.10:192.0.2.20,reuseaddr \
  STDOUT
```

### iperf (only if multicast enabled in your build)

```text
# Example patterns vary by iperf2/iperf3 fork—verify manpage
# Prefer custom sequencer for trading-style proof
iperf -c 239.10.10.10 -u -T 16 -t 30 -i 1
```

### mtrace2 (where available)

```text
mtrace2 192.0.2.10 232.10.10.10
```

### Safe production hygiene

```text
# Use documentation prefixes in labs: 192.0.2.0/24, 198.51.100.0/24, 232/239 test groups
# Rate-limit generators; never aim unknown groups at production OIL
# Prefer SPAN/TAP over in-line capture on live feed cores
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **IGMP** | Join tools validate signaling without proving data plane capacity |
| **QoS** | Test traffic should enter the same class as production feeds |
| **Boundaries** | Lab groups must be permitted or tests falsely “fail” |

## Verification

A test is complete only when:

1. Sender sequence log exists.
2. At least two observation points agree on first missing seq.
3. Device counters or NIC stats explain the break—or the host path does.
4. Generator rate and size match the intended stress (pps vs Mbps).

```text
tcpdump -ni eth0 -tt 'udp and dst host 232.10.10.10'
show ip mroute 192.0.2.10 232.10.10.10 count
ethtool -S eth0
```

## Risks

- Flooding production groups during “connectivity checks.”
- Declaring success from `iperf` average bitrate without sequences.
- Single-point capture that cannot localize the loss domain.

## Interview framing

“Safe multicast testing uses sequenced generators, allowlisted lab groups, and multi-point captures—bandwidth tools alone cannot prove lossless delivery.”

---
