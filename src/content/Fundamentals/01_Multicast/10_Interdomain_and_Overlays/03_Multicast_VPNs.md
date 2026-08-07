# Multicast VPNs over MPLS and BGP

A BGP/MPLS Multicast VPN (MVPN) transports a customer's multicast service between provider-edge routers while keeping customer multicast state separated by VRF. Several control and transport layers work together; “BGP carries multicast” is too imprecise to describe them.

## Customer and provider planes

| Plane | Naming | Function |
|---|---|---|
| customer multicast | C-multicast / C-PIM | customer sources, groups, RPs, and CE-PE tree signaling |
| provider multicast | P-multicast / P-tunnel | carries replicated packets between PEs through provider core |
| VPN discovery/signaling | BGP MCAST-VPN | discovers MVPN PEs, carries C-tree joins, and binds flows to tunnels |
| VPN forwarding state | MVPN-TIB / VRF MFIB | keeps one tenant's multicast tree separate from another |

Provider P routers normally do not learn customer `(C-S,C-G)` routes. They forward transport tunnels or MPLS labels toward PEs.

## PMSI model

A **P-Multicast Service Interface (PMSI)** is a conceptual PE-to-PE multicast interface instantiated by a provider tunnel.

- **I-PMSI:** inclusive PMSI reaching all participating PEs for an MVPN; good for discovery, low-volume traffic, and unknown receiver location.
- **S-PMSI:** selective PMSI reaching only PEs interested in chosen flows; saves bandwidth for high-rate `(C-S,C-G)` traffic.
- **MI-PMSI:** multipoint-to-multipoint inclusive variant used by some profiles.

The PMSI Tunnel Attribute tells remote PEs the tunnel type, tunnel identifier, optional MPLS label, and whether explicit leaf information is required.

## Provider tunnel choices

| Transport | Core state | Replication location | Trade-off |
|---|---|---|---|
| ingress replication | unicast tunnel state | ingress PE sends one copy per remote PE | simple core, high ingress/underlay bandwidth |
| mLDP P2MP/MP2MP | multipoint LSP state | provider tree branches | efficient data, more label/control state |
| RSVP-TE P2MP | engineered P2MP LSP state | provider tree branches | traffic engineering with operational complexity |
| PIM tree / GRE or IP | multicast tree state | provider multicast branches | native tree efficiency, provider PIM dependency |

The tunnel is not the customer tree. A P-tunnel can aggregate several customer flows or VPNs, with labels identifying the correct MVPN at egress.

## Receiver-driven flow

For an SSM customer flow:

1. receiver joins `(C-S,C-G)` at a receiver CE;
2. receiver PE learns the C-PIM Join and creates VRF/MVPN state;
3. BGP distributes a Source Tree Join C-multicast route toward the source-side PE;
4. source PE maps the customer flow to the I-PMSI or an S-PMSI;
5. interested remote PEs join or become leaves of the associated P-tunnel;
6. source PE encapsulates/labels the customer packet;
7. P-tunnel replicates it to receiver PEs; and
8. each receiver PE decapsulates and forwards through its VRF to the CE.

ASM adds RP/shared-tree and source-active considerations. The customer RP can live at a site, on a PE, or use another supported profile; the chosen model changes which Shared Tree Join and Source Active routes appear.

## Inclusive-to-selective transition

A high-rate flow may start on the I-PMSI, then move to an S-PMSI:

1. source PE advertises an S-PMSI A-D route binding `(C-S,C-G)` or a wildcard to a selective tunnel;
2. receiver PEs join/respond as required by the tunnel type;
3. source PE begins sending on the S-PMSI;
4. overlap must avoid loss and control duplicate delivery; and
5. the flow can later return to the inclusive tree when policy changes.

This resembles RPT-to-SPT optimization conceptually, but it is a provider-tunnel binding process, not ordinary PIM-SM SPT switchover.

## Failure domains

- CE-PE membership/PIM failure;
- missing VPN multicast route target import/export;
- MCAST-VPN AFI/SAFI session or route-reflector policy failure;
- wrong upstream PE selection for `C-S` or customer RP;
- PMSI Tunnel Attribute or label mismatch;
- provider tunnel/LSP failure;
- I-PMSI to S-PMSI transition loss/duplication;
- VRF MFIB or label programming failure;
- MTU loss from MPLS/GRE/IP encapsulation.

Troubleshoot from customer membership to C-multicast BGP route, PMSI binding, provider tunnel, label/encapsulation, remote VRF state, and final CE delivery. A healthy BGP VPN route table proves only one layer.
