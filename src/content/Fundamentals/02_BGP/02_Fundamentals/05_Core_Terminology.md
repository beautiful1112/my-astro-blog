# Core BGP terminology

Precise terms prevent false diagnoses. Platforms reuse words like “active,” “valid,” and “best” with overlapping but not identical meanings—always map vocabulary to the RFC concepts and then to the vendor CLI.

## Essential definitions

| Term | Meaning |
|---|---|
| **AS** | Autonomous System: a routing domain presenting a coherent external routing policy |
| **ASN** | Autonomous System Number; modern BGP supports four-octet ASNs (RFC 6793) |
| **BGP speaker** | Router (or host process) implementing BGP |
| **Peer / neighbor** | Speaker with which a BGP session is configured/established |
| **NLRI** | Network Layer Reachability Information—the destination key (e.g. prefix) |
| **eBGP / iBGP** | Session between different ASNs / within the same ASN |
| **BGP Identifier** | 32-bit speaker ID; written like IPv4 but need not be a usable forwarding address under updated rules |
| **Path / route** | NLRI plus its path attributes as learned from a peer (or injected) |
| **Best path** | Path selected by the local decision process for an NLRI among eligible BGP paths |
| **Eligible / feasible** | Path that passed validation (next hop, loop checks, policy) and may compete |
| **Adj-RIB-In** | Per-peer learned routes (pre- and/or post-policy storage varies) |
| **Loc-RIB** | Local selected BGP routes after decision process |
| **Adj-RIB-Out** | Per-peer routes to be advertised after export policy |
| **RIB / FIB** | Control-plane routing table / forwarding entries used for packets |
| **AFI / SAFI** | Address Family Identifier / Subsequent AFI—kind of NLRI carried |
| **Capability** | OPEN optional feature advertisement (MP-BGP, refresh, 4-byte AS, …) |

See [What BGP is](01_What_BGP_Is.md), [Three conceptual RIBs](../07_RIBs_and_Updates/01_Three_Conceptual_RIBs.md), and [Capability negotiation](../06_Messages_and_Capabilities/06_Capability_Negotiation.md).

## “Active” and related platform words

| Word | Common meaning | Caution |
|---|---|---|
| FSM **Active** | TCP connect failed; retrying/listening | Does **not** mean the session is working |
| **Active** path (Cisco-ish) | Often: selected/installed candidate | Confirm against Loc-RIB and RIB |
| **Valid** | Passed basic checks | May still lose best-path |
| **Multipath** | Multiple installed forwarding paths | Requires eligible equal (or configured unequal) paths |
| **Stale** | Retained during GR/LLGR | Must be cleaned when refresh completes |

## Session vs family vs prefix

Keep these scopes distinct:

1. **Session** — TCP + BGP FSM to a neighbor (Established or not).
2. **Address family** — negotiated and activated AFI/SAFI on that session.
3. **Prefix/NLRI** — individual reachability entry within a family.

A healthy session can carry an inactive family; an active family can carry zero accepted prefixes.

## Configuration patterns (seeing terms in CLI)

### Cisco IOS / IOS XE

```text
show bgp summary
show ip bgp neighbors 192.0.2.1
show ip bgp 203.0.113.0/24
! Status codes: * valid, > best, i internal, etc.
```

### Junos

```text
show bgp summary
show bgp neighbor 192.0.2.1
show route protocol bgp table inet.0
show route receive-protocol bgp 192.0.2.1
```

### FRRouting

```text
show bgp summary
show bgp neighbors 192.0.2.1
show bgp ipv4 unicast 203.0.113.0/24
```

## Interactions

| Term collision | How to disambiguate |
|---|---|
| Active FSM vs active route | Check state column vs path status codes |
| Best vs installed | Compare BGP table to `show ip route` / FIB |
| Peer AS vs path AS_PATH | Neighbor ASN ≠ full vector of AS hops |
| Router-ID vs NEXT_HOP | Identifier is not automatically the forwarding next hop |

## Verification lab

1. Put a neighbor in FSM Active; say aloud what is broken (transport), what is not (prefix policy).
2. Mark a path best in BGP with unresolved next hop; confirm terminology for “best but not installed.”
3. Disable one AFI while leaving session Established; describe session/family/prefix scopes.

## Risks

- Saying “BGP is down” when only one family failed.
- Equating router-ID with a reachable loopback used as update-source.
- Mixing Adj-RIB-In post-policy absence with “peer did not send.”

## Interview framing

“I separate session, AFI/SAFI, and NLRI; best path is a BGP decision outcome, and installed/forwarding is a RIB/FIB outcome—platform words like active must be mapped carefully.”

---
