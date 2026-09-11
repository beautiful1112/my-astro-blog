# LAN roles and loss controls

## LAN control roles

- IGMP querier maintains receiver membership.
- PIM DR originates joins or registers on the shared LAN.
- PIM Assert elects one forwarder when duplicate streams reach the LAN.
- IGMP snooping restricts delivery to receiver ports; source-only ports need no membership.

## Loss controls

- Monitor sequence gaps at the feed handler and subscriber.
- Capture before normalization and at the consumer boundary.
- Correlate NIC, switch, queue, and application counters.
- Validate ECMP/RPF changes and multicast reconvergence.

Low average bitrate does not rule out microbursts. Sequence gaps are the application-visible loss signal; packet counters are not a substitute.

## Related

- [SSM, ASM, and BUM](03_SSM_ASM_and_BUM.md)
- [Silent receiver and blackholes](../13_Troubleshooting/03_Silent_Receiver_and_Blackholes.md)
- [Latency distribution](../10_Low_Latency_and_PTP/01_Latency_Distribution.md)
- [PIM Assert](../../01_Multicast/07_RPF_and_Forwarding/05_PIM_Assert.md)

---
