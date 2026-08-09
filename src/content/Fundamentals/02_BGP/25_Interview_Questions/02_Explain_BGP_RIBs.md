# Interview: Explain the Three BGP RIBs

## Question

Explain Adj-RIB-In, Loc-RIB, and Adj-RIB-Out. Where does policy apply?

## Strong answer

Conceptually:

| RIB | Contents |
|---|---|
| **Adj-RIB-In** | Routes learned from a peer, before or after inbound policy depending on platform/view |
| **Loc-RIB** | Routes selected by this speaker after decision process (per AFI/SAFI/VRF) |
| **Adj-RIB-Out** | Routes to be advertised to a peer after outbound policy and topology rules (split horizon, RR) |

Inbound policy gates what becomes eligible for Loc-RIB. Best-path picks Loc-RIB winners (subject to next-hop resolvability). Outbound policy and iBGP/RR rules build Adj-RIB-Out. Operators must name which view a `show` command exposes—`received-routes` vs `routes` vs `advertised-routes`.

## Follow-ups

- How do soft-reconfiguration and route-refresh differ for Adj-RIB-In?
- Where do SoO and conditional advertisement suppress Adj-RIB-Out?
- How does ADD-PATH change what clients store?

## Cross-links

[Three conceptual RIBs](../07_RIBs_and_Updates/01_Three_Conceptual_RIBs.md), [Five route views](../21_Operations_and_Observability/05_Received_Accepted_Best_Installed_Advertised.md).

---
