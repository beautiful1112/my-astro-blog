# Packet-capture interpretation

Useful Wireshark filters:

```text
igmp
pim
icmpv6.type == 130 || icmpv6.type == 131 || icmpv6.type == 132 || icmpv6.type == 143
ip.src == 192.0.2.10 && ip.dst == 232.10.10.10
```

Check destination MAC mapping, VLAN tags, expected unicast source, remaining TTL, lengths/MTU, sequence boundaries, and timestamp source. On-host egress captures may show false bad checksums because hardware offload computes them later.

