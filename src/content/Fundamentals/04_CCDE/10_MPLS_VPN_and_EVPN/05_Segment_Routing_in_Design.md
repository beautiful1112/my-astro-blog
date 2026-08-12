# Segment routing in design

SR encodes the path in the packet (SID list or prefix SID) so the core needs **less per-flow RSVP state**. TI-LFA, Flex-Algo, SR-TE, and SRv6 are Large-Scale elective depth; core CCDE still expects the idea.

## When SR helps

- Simpler FRR than classic TE mesh
- Controller-optional TE (ODN, policies) on a BGP/IGP underlay
- Migration from LDP (interworking is a real phase)

## When it is optional

A stable LDP L3VPN that meets RTO does not need an SR project for the exam answer “because future.” Migration cost is a constraint.

## Interview framing

“SR is source-routed underlay with less core state. I adopt it when I need TI-LFA/TE at scale—not as a sticker on a working LDP VPN.”

---
