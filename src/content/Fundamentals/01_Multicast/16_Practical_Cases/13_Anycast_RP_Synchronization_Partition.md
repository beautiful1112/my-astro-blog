# Case 13: Anycast RP reachability survives a synchronization partition

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Topology

RP-A and RP-B advertise shared anycast address `10.255.0.1`. Sources near site A register to RP-A; receivers near site B join RP-B. The unique-address MSDP session or RFC 4610 Register-copy path between the RPs fails, but both anycast routes stay installed.

## Symptom pattern

| Source | Receiver | Result |
|---|---|---|
| site A | site A | works |
| site B | site B | works |
| site A | site B | fails |
| site B | site A | fails |

Local monitoring reports both RPs reachable and some channels healthy, creating false confidence.

## State explanation

- FHR-A Registers `(S-A,G)` only to nearest RP-A;
- LHR-B `(*,G)` terminates at nearest RP-B;
- without SA or copied-Register synchronization, RP-B never learns `S-A`;
- it cannot send `(S-A,G)` Join despite having receiver interest.

## Investigation

1. resolve the physical anycast member selected at FHR and LHR;
2. inspect unique-address reachability separately from shared address;
3. for MSDP, check session, SA received/accepted, filters, and peer-RPF;
4. for PIM Anycast, check identical member lists and copied Data/Null-Registers;
5. inspect source state on every RP member;
6. add a new cross-site source and receiver while capturing synchronization.

## Recovery and risk

Restoring only the anycast IGP prefix changes nothing because it was never broken. Restore the synchronization plane, then verify source state propagates and the receiver-side RP joins the source.

If choosing route withdrawal as a fallback, ensure service health can withdraw an RP whose synchronization is unusable; otherwise routing continues to select a partially functioning member.

## Lesson

Anycast reachability, RP processing, and active-source synchronization need independent monitoring and failure tests.
