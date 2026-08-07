# BGP MVPN route types and PMSI bindings

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

BGP MVPN uses the MCAST-VPN NLRI. Its route type identifies whether the update performs PE auto-discovery, tunnel binding, source-active advertisement, leaf tracking, or customer-tree signaling.

## RFC 6514 route types

| Type | Route | Main purpose |
|---:|---|---|
| 1 | Intra-AS I-PMSI A-D | discover a PE's participation and inclusive tunnel inside one AS |
| 2 | Inter-AS I-PMSI A-D | advertise/aggregate inclusive MVPN connectivity between ASes |
| 3 | S-PMSI A-D | bind selected customer flow(s) to a selective provider tunnel |
| 4 | Leaf A-D | explicit leaf response for a tunnel that requests leaf tracking |
| 5 | Source Active A-D | advertise an active customer source/flow |
| 6 | Shared Tree Join | carry customer `(*,C-G)` interest toward the customer RP/upstream PE |
| 7 | Source Tree Join | carry customer `(C-S,C-G)` interest toward the source/upstream PE |

Types 1-5 are auto-discovery/tunnel/source advertisements. Types 6-7 are C-multicast routes representing customer tree interest.

Route-type numbers are scoped to their BGP NLRI family. MCAST-VPN Type 6/7 routes are **not** EVPN Type 6/7 routes; always identify the AFI/SAFI and NLRI before interpreting a route number.

## Route Target role

MVPN routes use Route Targets to reach only PEs participating in the relevant VPN or upstream selection. Incorrect import/export can create two opposite failures:

- missing RT: receiver PE never learns source/tunnel information;
- overly broad RT: unrelated PEs import state or traffic, wasting resources and risking leakage.

The RD makes otherwise identical customer routes unique; it is not a policy boundary by itself.

## PMSI Tunnel Attribute

An I-PMSI or S-PMSI advertisement commonly carries a PMSI Tunnel Attribute with:

- tunnel type;
- MPLS label or no label depending on profile;
- tunnel identifier, such as root and P2MP LSP identity;
- Leaf Information Required flag.

The receiving PE must resolve the tunnel identifier, join or instantiate the provider tunnel, program label demultiplexing, and associate the resulting conceptual interface with the correct MVPN-TIB.

## Example transition

```text
Initial:
  Type 1 I-PMSI A-D -> all VPN PEs know inclusive tunnel
  (C-S,C-G) data -> I-PMSI

High-rate threshold crossed:
  Type 3 S-PMSI A-D -> binds (C-S,C-G) to selective P-tunnel
  Type 4 Leaf A-D -> interested PEs identify themselves if required
  data -> S-PMSI after make-before-break
```

A Type 3 route without a usable PMSI Tunnel Attribute is signaling without transport. A working P-tunnel without the correct MVPN label/VRF association can deliver packets to the wrong lookup context or drop them at decapsulation.

## Upstream PE selection

Receiver PEs use VPN unicast/multicast reachability and MVPN procedures to identify the PE upstream toward `C-S` or the customer RP. They then advertise Type 6 or Type 7 routes targeted toward that upstream multicast hop.

This is not ordinary BGP best-path forwarding to multicast group `C-G`. The relevant root is a customer **unicast address** (`C-S` or C-RP), while the C-multicast NLRI also carries group/source identity.

## Troubleshooting route types

Follow this dependency order:

1. Type 1/2: did relevant PEs discover one another and inclusive transport?
2. Type 6/7: did receiver interest select the correct upstream PE?
3. Type 5: is source-active signaling required/present for the profile?
4. Type 3: did a selective binding replace the inclusive path?
5. Type 4: did required leaves respond?
6. PMSI attribute: can every receiver PE instantiate the advertised tunnel?
7. label/VRF: does decapsulation select the correct MVPN?
8. data counters: does the customer packet traverse ingress PE, P-tunnel, egress PE, and CE?

Route presence is necessary but insufficient; always correlate it with provider tunnel and VRF MFIB state.
