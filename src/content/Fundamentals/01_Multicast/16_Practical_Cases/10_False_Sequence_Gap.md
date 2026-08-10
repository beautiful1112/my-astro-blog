# Case 10: False sequence gap without packet loss

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Topology and symptom

Receiver `198.51.100.20` joins `(192.0.2.10,232.10.10.10)`. Network captures show contiguous UDP datagrams with no drops at TAP or NIC. The decoder nonetheless alarms on sequence gaps, especially after session resets or during dense bursts where one datagram carries multiple application messages.

```text
UDP datagram N:  msg seq 100, 101, 102
UDP datagram N+1: msg seq 103, 104
Naive decoder: "one datagram = one sequence" → false gap
```

## Failure mechanism

A single UDP datagram can contain multiple application messages, and session resets may redefine or restart the sequence space. A decoder that assumes one datagram equals one application sequence, or that ignores venue-specific reset rules, reports false gaps. Network packet sequence, protocol message sequence, event sequence, and book-update identity may be separate layers.

## Evidence

- TAP and host RX show contiguous UDP packet counters;
- gap alarms cite missing message sequences that exist inside multi-message datagrams;
- incidents cluster at session negotation, template changes, or failover;
- raw hex of a “gapped” interval still contains the supposedly missing seqs;
- a venue-compliant reference decoder shows no loss on the same PCAP;
- multicast routing, RPF, and IGMP state were stable throughout.

## Investigation

1. save PCAPs for the alarmed window and parse with a venue-aware tool;
2. count UDP datagrams versus application messages per datagram;
3. check for session reset, sequence wrap, or channel-ID changes;
4. compare network sequence (if any) with application sequence fields;
5. verify the decoder’s assumptions against the exact venue specification;
6. only after ruling out decode logic, reopen loss/RPF investigations.

## Fix and validation

Update the decoder to follow framing, multi-message packing, and reset rules from the venue spec. Separate monitoring for wire loss versus application-layer sequence.

Replay the PCAP through the fixed decoder and confirm alarms clear while packet counters remain unchanged.

## Lesson

Not every sequence alarm is packet loss. Treat network packet sequence, protocol message sequence, and book identity as distinct layers, and follow the venue specification before blaming the fabric.
