# Mrouter ports, snooping querier, and proxying

Listener ports say where receivers live. Multicast-router ports say where membership reports and routed multicast control/data must travel. A switch needs both kinds of state.

## How mrouter ports are learned

A switch may identify a multicast-router-facing port from:

- an IGMP/MLD Query with a valid querier source;
- PIM Hellos or other multicast-router discovery traffic;
- Multicast Router Discovery messages;
- static configuration; or
- control-plane information from an overlay/MLAG system.

The exact triggers and timers are implementation-specific. A port learned only from periodic Queries can disappear when the querier moves, even if the router still forwards multicast through another interface.

Membership Reports are normally sent to all mrouter ports so every relevant router/control function sees receiver interest. Data may also need to reach router ports so it can cross routed boundaries.

## Snooping querier is not a multicast router

A Layer-2 switch can generate IGMP/MLD Queries solely to keep snooping state alive in a VLAN with no routed multicast interface. This **snooping querier**:

- triggers periodic host Reports;
- participates in the membership querier rules as implemented;
- does not create PIM trees;
- does not decrement TTL/Hop Limit or route data between VLANs; and
- must use a valid source/interface identity according to protocol and platform requirements.

If receivers and sources share one isolated VLAN, that may be all the control function required. If traffic must cross VLANs, an actual multicast router/LHR and Layer-3 tree are still necessary.

## Querier placement and redundancy

Provide a stable querier in every snooping-enabled VLAN. With multiple queriers, ensure election rules yield one active sender and that takeover occurs before membership state expires. Verify switch behavior when the querier source is `0.0.0.0`, when an SVI is down, or when an MLAG peer loses its peer link.

“Two switches have snooping enabled” is not querier redundancy unless both are capable, addressed, and tested under the same VLAN failure conditions.

## Report suppression and proxying

A snooping switch may suppress duplicate reports or proxy aggregate membership toward the router. This reduces control traffic but changes observability:

- an uplink capture may show one report although many hosts joined;
- host-specific source filters must be merged correctly;
- a switch failure must rebuild aggregate state upstream;
- fast leave cannot assume one host merely because only one proxy report is visible.

When debugging, inspect the switch's per-port state rather than relying only on a router-side packet capture.

## Router-port failure pattern

If a listener entry exists but the mrouter port is absent:

- reports may never reach the LHR, so no PIM Join is created;
- routed data may not enter/leave the VLAN as intended;
- local same-VLAN receivers may still work, hiding the problem;
- statically forcing the port can restore service but also mask missing Queries/PIM or topology errors.

Validate the reason and expiry timer for every mrouter port, then test movement to the redundant router/uplink.
