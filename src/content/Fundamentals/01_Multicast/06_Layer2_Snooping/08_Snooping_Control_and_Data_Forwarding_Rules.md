# Snooping control and data forwarding rules

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

A snooping switch treats membership control packets differently from multicast data. Applying one generic “multicast forwarding” rule to both can suppress Reports, break routing protocols, or leak data.

## IGMP control forwarding

RFC 4541 recommends that a snooping switch:

- forward Membership Reports toward multicast-router ports rather than ordinary host-only ports;
- preserve Reports whose source is `0.0.0.0`, because proxy/reporting behavior can legitimately use it;
- flood unrecognized IGMP message types instead of interpreting unknown fields incorrectly;
- forward Queries from a valid querier toward host-facing ports;
- learn or configure the ports where multicast routers are attached.

For IGMPv1/v2, sending one host's Report to other hosts can trigger report suppression. If the switch then records only the wrong port, other receivers may not be programmed. IGMPv3 does not use the same host-to-host report suppression behavior, but the switch still needs correct per-port source state.

## Data forwarding outside `224.0.0.0/24`

Ordinary IPv4 multicast data outside the link-local control block is forwarded to:

```text
effective L2 replication list = listener ports + mrouter/static ports - blocked/down ports
```

The switch may build the entry from IP group membership or only from destination MAC. IP-based tables distinguish IPv4 groups that map to the same Ethernet MAC; MAC-only tables can over-deliver all 32 aliased groups to the union of ports.

## Link-local control groups

Traffic to `224.0.0.0/24` is commonly required by hosts and routers without an explicit IGMP Join. RFC 4541 therefore recommends forwarding non-IGMP packets in this block on all ports. Examples include routing and discovery protocols.

Aggressively pruning these groups based on listener state can break PIM, routing adjacencies, mDNS-like controls, or first-hop protocols. A platform may implement optimized control-plane handling, but the result must preserve the required link-local behavior.

## IPv6 differences

MLD is carried in ICMPv6 rather than a separate IP protocol. A snooping switch must recognize the IPv6 Hop-by-Hop Router Alert behavior and must not apply IPv4 IGMP state to IPv6 traffic. IPv6 Neighbor Discovery and solicited-node multicast make correct IPv6 multicast forwarding a prerequisite for ordinary IPv6 operation.

Maintain separate IPv4 and IPv6:

- listener tables;
- mrouter ports;
- querier state;
- unknown-multicast policy; and
- resource/scale counters.

## Unknown multicast

Data for a group without a programmed entry can be:

- flooded within the VLAN;
- sent only to mrouter/static ports;
- rate-limited/punted; or
- dropped.

The correct choice depends on security and loss tolerance. Drop-by-default prevents unwanted fan-out but creates a first-packet race between Report processing and ASIC programming. Flooding preserves delivery but exposes every host and uplink to unwanted traffic.

## Special packet classes

| Packet | Expected handling question |
|---|---|
| IGMP/MLD Report | did it reach every relevant router/proxy port? |
| General Query | did every listener-facing port receive it? |
| Leave/state change | was safe last-listener processing used? |
| PIM Hello | did snooping/control policy preserve all-PIM-router delivery? |
| link-local multicast | is it exempt from ordinary listener pruning? |
| unknown data group | flood, router-only, punt, or drop? |
| source-specific data | can hardware enforce `(VLAN,S,G)` or only `(VLAN,G)`? |

## Capture method

Capture simultaneously on host port and router uplink. If a Report exists on the host port but not the uplink, the failure is Layer 2 control forwarding. If the Report reaches the LHR but data never reaches the host port, inspect listener/replication programming. This separates the two rule sets cleanly.
