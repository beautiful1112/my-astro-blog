# Reverse Path Forwarding check

For `(S,G)`, the router asks: if I sent unicast toward `S` using the MRIB, which interface and neighbor would I use? The multicast packet must arrive from that direction. Otherwise it is normally discarded as an RPF failure.

```text
(192.0.2.10, 232.10.10.10)
IIF: Ethernet1/1, RPF neighbor 198.51.100.1
OIL: Ethernet1/2, Port-Channel20
```

A packet arriving on Ethernet1/1 passes and is replicated to the OIL. Arrival on Ethernet1/3 fails. For shared-tree `(*,G)` traffic, the RPF target is generally the RP rather than the source.

