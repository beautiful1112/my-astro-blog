# Anycast RP

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Anycast RP makes several physical routers appear as one logical RP. Every member owns the same anycast RP address, normally on a loopback, and advertises an equal prefix into the routing domain. Each also has a unique address for synchronization and management.

```text
FHR-A --nearest--> RP-A (anycast 10.255.0.1) <-- nearest-- LHR-A
FHR-B --nearest--> RP-B (anycast 10.255.0.1) <-- nearest-- LHR-B
                         RP-A <== source state ==> RP-B
```

FHRs send Registers and LHRs send `(*,G)` Joins toward the **same logical address**, but unicast routing can deliver them to different physical RPs. Source-state synchronization is what makes those disjoint arrivals meet.

## Plane 1: anycast reachability

- all members originate exactly the shared RP prefix;
- the prefix must not accidentally be summarized or originated by a non-member;
- routing should select a nearby member and withdraw failed members promptly;
- a unique member address must remain distinct from the shared address;
- PIM RPF toward the anycast address should match the intended topology.

Anycast reachability alone is insufficient. It can make RP-A locally reachable to the source while receiver joins terminate at RP-B.

## Plane 2 option A: Anycast RP with MSDP

Members peer with one another using unique addresses and advertise active sources in MSDP Source-Active messages. An RP with local `(*,G)` interest can then send `(S,G)` Join toward a source learned from another member.

Operational requirements include:

- stable TCP port 639 sessions between unique addresses;
- correct peer-RPF and originator handling;
- SA filters that permit intended `(S,G)` while blocking leakage;
- a full or otherwise valid peering topology; and
- SA/source state that survives the expected failure sequence.

This model synchronizes source knowledge, not `(*,G)` receiver branches. Each RP independently owns the RPT branches that join its anycast location.

## Plane 2 option B: Anycast RP using PIM

RFC 4610 avoids MSDP between members. Every member is configured with the unique addresses of all other members. When an RP receives a Register from an ordinary FHR, it copies that Register to the other members using its unique address as the new outer source. Recipients learn `(S,G)` and can serve their local shared trees.

Important rules:

- the shared anycast address and unique inter-RP addresses must differ;
- member lists must be consistent;
- a Register received from another member is not replicated again, preventing a loop;
- Null-Registers are also copied so active-source state remains alive;
- the set should remain small because Register replication grows with members and sources.

PIM Anycast-RP can remove **internal** MSDP synchronization, but external IPv4 ASM source discovery may still require MSDP.

## Failure cases

| Failure | Expected behavior | Hidden risk |
|---|---|---|
| one anycast route withdrawn | FHR/LHR RPF moves to another member | new member may lack source state if synchronization failed |
| RP process fails but route remains | traffic continues routing to dead service | use health-coupled route origination where supported |
| inter-RP sync fails | local sources/receivers may work | cross-member source/receiver pairs fail |
| member list differs | partial Register propagation or loops/TTL exhaustion | configuration must be identical |
| MSDP session fails | cached/established SPTs can mask it | test a new source and new receiver |
| shared prefix has unequal length | routing may prefer an unintended more-specific | originate the same exact prefix everywhere |

## Validation matrix

Test each combination, not merely one local flow:

1. source near RP-A, receiver near RP-A;
2. source near RP-A, receiver near RP-B;
3. source near RP-B, receiver near RP-A;
4. new source after one RP fails;
5. new receiver after one RP fails;
6. established RPT and SPT flows during failure;
7. RP control process failure with loopback interface still up; and
8. synchronization loss while anycast routes remain healthy.

For every case verify the actual physical RP reached, the synchronized `(S,G)` state, native Join toward the source, and receiver delivery.

