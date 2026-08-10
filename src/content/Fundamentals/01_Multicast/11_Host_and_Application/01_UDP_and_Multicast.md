# UDP and multicast

Multicast is not synonymous with UDP, but real-time one-to-many applications commonly use UDP because it is message-oriented and carries no per-receiver connection state. TCP’s acknowledgements, ordering, flow control, and congestion state are per connection and do not naturally map to a dynamic multicast group.

UDP supplies ports and checksum/error detection. It does **not** provide recovery, ordering, duplicate suppression, pacing, congestion control, or receiver feedback. Applications implement those properties when needed—market-data handlers especially.

## Why UDP fits multicast

| Property | TCP | UDP multicast |
|---|---|---|
| Fan-out | One sender state per receiver | One datagram, many receivers |
| Head-of-line | Slow peer stalls the stream | Independent receivers |
| Ordering / reliability | Built-in | Application sequences |
| Congestion | Per-connection windows | Application / network design |
| Join / leave | Connection setup | IGMP/MLD membership |

An exchange or media encoder that opened thousands of TCP sessions would pay connection memory, retransmission amplification, and head-of-line blocking when any single client paused. Multicast UDP removes that coupling; the cost is that **every** receiver must detect and repair loss independently.

## What the network provides versus the app

```text
Network:  deliver G (or (S,G)) to interested ports; drop on congestion; no per-packet ACK
Host:     join, receive, drop under load, deliver to socket
App:      sequence, A/B arbitrate, retransmit/snapshot, stale-book rules
```

Related: [Application reliability](08_Application_Reliability.md), [Why exchanges use multicast](../12_Quant_Trading_Market_Data/01_Why_Exchanges_Use_Multicast.md).

## Ports, checksums, and message boundaries

- Destination UDP port selects the listening application; many feeds use a fixed port per channel.
- UDP checksum covers pseudo-header + UDP header + payload (optional zero on IPv4; mandatory on IPv6).
- Each `sendto`/`recvfrom` is one datagram. Partial reads do not reassemble TCP-style streams—fragmentation is an IP-layer failure mode (see [MTU](07_MTU_and_Fragmentation.md)).

## Configuration patterns (host)

### Linux / Python sketch

```text
# Receiver: datagram socket, bind port, then join (not shown here)
socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP)
bind(0.0.0.0, 15000)

# Sender: no join required
sendto(payload, (239.10.10.10, 15000))
```

### Linux firewall note

```text
# Allow inbound market-data group (example only; tighten per host)
iptables -A INPUT -p udp -d 239.10.10.10 --dport 15000 -j ACCEPT
```

Joining a group does not bypass local firewall or reverse-path filters.

## Interactions

| Mechanism | Relationship |
|---|---|
| **IGMP/MLD** | Creates interest; UDP still needs a bound socket |
| **SSM** | App joins `(S,G)`; UDP destination is still `G` |
| **TCP alternatives** | Unicast recovery/snapshot often use TCP/TLS beside the multicast feed |
| **QUIC / custom** | Rare for venue feeds; still one-to-one unless reinvented |

## Verification

1. Capture: `udp and dst host 239.10.10.10 and dst port 15000`.
2. Confirm payload length matches application message size (no unexpected IP fragments).
3. Confirm sender does **not** send IGMP Reports for `G` unless it also receives.
4. On the receiver, `ss -uapn` shows the process bound to the port; membership is separate (`/proc/net/igmp`).

```text
tcpdump -ni eth0 -vv 'udp and dst host 239.10.10.10'
cat /proc/net/igmp
ss -uapn | grep 15000
```

## Risks

- Treating “UDP multicast up” as end-to-end reliability.
- Relying on UDP checksum alone for application integrity (use app CRCs/sequences).
- Mixing TCP mental models (MSS, windows) into multicast capacity planning.

## Interview framing

“Multicast delivers the same datagram to many receivers efficiently; UDP is the usual transport because TCP’s per-receiver reliability and congestion control do not scale to dynamic groups—applications own sequencing and recovery.”

---
