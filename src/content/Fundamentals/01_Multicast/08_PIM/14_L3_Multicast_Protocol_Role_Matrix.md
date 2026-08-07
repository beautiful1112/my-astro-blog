# Layer-3 multicast protocol role matrix

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

No single Layer-3 protocol provides membership, topology, source discovery, tree signaling, VPN transport, and application reliability. The most useful presentation is by problem solved.

| Mechanism | Scope | Input/state | Output/function | Does not provide |
|---|---|---|---|---|
| IGMP/MLD | host to local router | `G` or source-filter interest | local receiver OIF | routed tree |
| PIM-SM | router domain | MRIB, RP mapping, joins | RPT and source trees | topology routes |
| PIM-SSM | router domain | explicit `(S,G)` interest | direct source tree | source discovery |
| PIM-DM | router domain | source data and prunes | flood-and-prune source tree | sparse efficiency/RP |
| BIDIR-PIM | router domain | RP address and DF state | bidirectional shared tree | shortest source tree |
| BSR/Auto-RP/static mapping | PIM domain | candidate/configured RPs | group-to-RP mapping | RP reachability/state sync |
| IGP/static mroute | routing domain | topology/policy | source/RP MRIB reachability | multicast tree signaling |
| MBGP SAFI 2 | interdomain/multitopology | source/RP prefixes | multicast-specific MRIB paths | `(S,G)` data/tree state |
| MSDP | IPv4 ASM RP domains | active local sources | SA source discovery | data transport |
| BGP MVPN | provider VPN | PE, C-tree, PMSI state | VPN discovery/tree/tunnel bindings | host membership protocol |
| mLDP/RSVP-TE/PIM P-tunnel | provider core | tunnel leaves/root | replicated provider transport | customer policy by itself |
| EVPN SMET proxy | overlay BD | local IGMP/MLD state | remote VTEP interest | underlay transport by itself |

## Composition examples

### Enterprise SSM

```text
IGMPv3 INCLUDE(S) -> LHR `(S,G)` -> IGP MRIB -> PIM Join -> MFIB replication
```

### Interdomain ASM

```text
IGMP `G` -> local PIM RPT
source Register -> local RP -> MSDP SA -> remote RP
MBGP route to S -> remote PIM `(S,G)` Join -> native data
```

### BGP/MPLS MVPN

```text
CE membership/PIM -> PE MVPN-TIB -> BGP Type 6/7 Join
PMSI A-D + Tunnel Attribute -> P-tunnel/label -> remote VRF MFIB
```

### EVPN bridged tenant multicast

```text
local IGMP/MLD -> PE proxy -> Type 6 SMET
SMET interest -> ingress replication/selective tunnel -> remote listener port
```

## Troubleshooting rule

For every mechanism ask:

1. what event should create its state?
2. what exact table/message proves that state exists?
3. which next mechanism consumes it?
4. what happens when it expires or changes?
5. which packet counter proves the data plane followed it?

This prevents a healthy protocol in one layer from being used as proof that the entire multicast service works.
