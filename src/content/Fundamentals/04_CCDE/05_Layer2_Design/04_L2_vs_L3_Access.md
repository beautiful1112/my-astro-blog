# L2 versus L3 at the access

The L2/L3 boundary is a **campus/DC architecture choice**, not a religion.

## Comparison

| | L2 access | L3 access |
|---|---|---|
| Host default GW | Distribution FHRP / anycast | Access switch SVI / anycast GW |
| Uplinks | L2 trunks or MLAG | Routed, ECMP |
| Failure domain | VLAN size | Typically one closet |
| Multicast/L2 apps | Easier for true L2 needs | Needs PIM at edge or L2 exception |
| Ops | Familiar VLAN model | More IGP adjacencies, better summary |

## When L2 access still wins

- True L2 adjacency (some clusters, OT, legacy)
- Staff cannot operate an IGP at the edge **and** time is short (constraint)
- Wireless/tunneled designs that already centralize L2 at a controller (different pattern)

## When L3 access wins

- Loop history, large campus, need for summarization and faster uplink recovery
- Fabric/SDA style (host is still Ethernet locally; fabric is L3)

Hybrid is common: L3 to building distribution, L2 only in the closet.

## Interview framing

“I push L3 toward the access when I need small failure domains and ECMP. I keep L2 only where an application or a hard skill/time constraint demands it.”

---
