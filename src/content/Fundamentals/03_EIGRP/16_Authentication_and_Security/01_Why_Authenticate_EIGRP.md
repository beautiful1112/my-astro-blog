# Why authenticate EIGRP

EIGRP hello/update traffic is normally a **multicast trust model**: any device that speaks the right AS, K-values, and addressing can become a neighbor and inject topology. Authentication binds neighbors to a shared secret so unauthorized routers cannot join the adjacency or poison the topology table.

## Threat model

| Threat | Without auth | With auth |
|---|---|---|
| Rogue router on LAN/WAN | Forms adjacency, injects routes | Hellos rejected |
| Accidental wrong AS device | May still peer if AS matches | Still needs keys |
| Replay / downgrade | Possible depending on algo | Key-id + HMAC reduce risk |
| Confidentiality of prefixes | **Not provided** | Still cleartext routing |

Authentication ≠ encryption. Packet captures still show prefixes; use IPsec/MACsec if confidentiality is required.

## What auth does *not* fix

- Wrong redistribution policy / loops
- Stub misconfiguration / SIA
- Metric mistakes / variance issues
- Compromised legitimate neighbor (insider with the key)

## Placement priorities

1. Internet-facing or partner VRFs carrying EIGRP (rare—prefer BGP).
2. WAN / DMVPN hub-spoke overlays.
3. Campus distribution links between administrative domains.
4. Lab and unmanaged access VLANs (often better: **passive-interface** + no EIGRP on access).

```text
Rogue router --Hello without valid digest--> Discard
Authorized peer --Hello with key-id digest--> Adjacency OK
```

## Defense in depth

| Control | Role |
|---|---|
| Authentication | Prove neighbor knows secret |
| Passive-interface | Stop hellos on access ports |
| Static neighbors | Unicast-only peering (NBMA / hardening) |
| ACL / CoPP | Limit who can send EIGRP (IP proto 88) |
| Stub | Limit query abuse blast radius |

## Interview framing

“EIGRP auth stops unauthorized adjacencies; it does not encrypt updates or replace prefix filters. Pair with passive interfaces and CoPP.”

## Operational acceptance criteria

Before calling a link “production ready,” require:

1. Auth mode and key chain documented in the circuit record.
2. Lab proof that wrong key fails adjacency.
3. Rollover SOP attached to the change calendar.
4. Passive-interface inventory for the same device reviewed so access LANs are not relying on auth alone.

## Mermaid threat path

```text
Unauthorized router --proto 88 hello--> Broadcast segment
Seg --no auth--> Adjacency + inject
Seg --auth mismatch--> Ignored hello
```

## Related reading for reviewers

Pair this note with CoPP standards: authenticating EIGRP does not stop floods of protocol 88 from consuming CPU—policers still matter on WAN edges.

## Related

- [MD5 Authentication and Key Chains](02_MD5_Authentication_and_Key_Chains.md)
- [Passive Interface as Control](05_Passive_Interface_as_Control.md)
- [Static Neighbors Hardening](04_Static_Neighbors_Hardening.md)

---
