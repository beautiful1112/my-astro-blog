# Lab 9: MBGP, MSDP, and interdomain PIM

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Goal

Build or model an IPv4 ASM flow whose source and receiver live in different PIM/RP domains. Prove the separate roles of MBGP, MSDP, and PIM.

## Topology

```text
Source S -- FHR/RP-A -- Border-A ===== Border-B -- RP-B/LHR -- Receiver
                 AS 65010             AS 65020
```

Use:

```text
S:          192.0.2.10
G:          239.10.10.10
RP-A:       10.255.1.1
RP-B:       10.255.2.1
MBGP:       IPv4 multicast SAFI across border
MSDP:       unique RP addresses
PIM-SM:     source, receiver, and inter-AS routed links
```

## Phase 1: establish topology only

1. configure PIM neighbors on every routed multicast hop;
2. establish BGP session with IPv4 multicast AFI/SAFI;
3. advertise only `192.0.2.0/24` from source AS;
4. verify Border-B/RP-B multicast RPF toward `192.0.2.10`;
5. compare the unicast and multicast next hops.

At this point there is topology but no source discovery or receiver tree.

## Phase 2: establish MSDP

1. peer RP-A and RP-B over TCP/639;
2. apply an SA policy permitting only source `192.0.2.0/24` and group `239.10.0.0/16`;
3. start source with no receiver;
4. observe FHR Register at RP-A and SA origination;
5. confirm RP-B receives and accepts the SA;
6. prove no continuing user data is carried inside MSDP.

## Phase 3: add receiver

1. join `G` at receiver;
2. follow `(*,G)` to RP-B;
3. observe RP-B use cached SA to initiate `(S,G)` Join;
4. follow Join across Border-B/Border-A using MBGP-selected RPF;
5. observe native data return;
6. optionally observe LHR SPT transition.

## Failure exercises

Perform one at a time:

- withdraw source prefix only from multicast SAFI;
- leave unicast route and ping working;
- deny SA at RP-B import policy;
- alter routing so MSDP peer-RPF expects another peer;
- block PIM protocol 103 at the AS boundary;
- allow control state but block multicast data `(S,G)`;
- stop RP-B while keeping its loopback reachable;
- restart source after Register suppression.

## Evidence table

```text
event/time | MBGP route | RPF neighbor | MSDP SA | PIM state | data sequence
```

For every failure identify the first missing state and the last working plane. The lab is complete only when you can create identical “no data” symptoms by independently breaking MBGP, MSDP, PIM, and the data ACL—and explain the different evidence for each.
