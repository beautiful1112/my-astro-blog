# L2 versus L3 at the access

The L2/L3 boundary is a **campus and DC architecture choice**, not a religion. You are choosing **failure-domain size**, uplink recovery behavior, and where the first-hop gateway lives.

## Comparison

| | L2 access | L3 access |
|---|---|---|
| Host default GW | Distribution FHRP / anycast | Access switch SVI / anycast GW |
| Uplinks | L2 trunks or MLAG | Routed, ECMP |
| Failure domain | VLAN size (often building-wide) | Typically one closet |
| Multicast / true L2 apps | Easier for legacy L2 needs | Needs PIM at edge or L2 exception |
| Ops | Familiar VLAN model | More IGP/BGP adjacencies, better summary |
| Spanning tree | Often still in play | Minimized or eliminated on uplinks |

```text
L2 access:
  Host -- Access(L2) ==== trunk ==== Dist(FHRP GW)
                              STP/MLAG domain

L3 access:
  Host -- Access(SVI GW) ---- routed ECMP ---- Dist/Core
              small flood domain per closet
```

## When L2 access still wins

- True L2 adjacency (some clusters, OT cells, legacy imaging)
- Staff cannot operate an IGP at the edge **and** calendar is short (constraint)
- Wireless/tunneled designs that already centralize user plane at a controller (different pattern—not “big campus VLAN”)

## When L3 access wins

- Loop history, large campus, need for summarization and faster uplink recovery
- Fabric/SDA style (host is still Ethernet locally; fabric underlay is L3)
- Desire to kill STP on inter-switch links

Hybrid is common: **L3 to building distribution, L2 only inside the closet**.

## Decision table

| Driver | Prefer L2 access | Prefer L3 access |
|---|---|---|
| Flood / loop history | — | Yes |
| App needs same L2 subnet across closets | Yes (or redesign app) | No |
| Summarization at building edge | Hard | Natural |
| OT / vendor “same VLAN” mandate | Often forced | Exception VLAN only |
| Ops skill = VLAN + FHRP only | Yes short-term | Train or hire first |

## Real-world — manufacturing plant floor

**Context:** PLC vendors require L2 adjacency inside a cell; IT wants routed campus elsewhere.

| R / C / A | Statement |
|---|---|
| R | Cell A loop must not take down Cell B or the MES servers |
| R | MES clients at offices use L3; RTO for office ≠ RTO for cell |
| C | Vendor support voids if cell is renumbered this shutdown |
| A | “We can stretch cell VLANs to the DC for backup” — reject unless proven |

```text
Cell A L2 (local) -- L3 firewall/router -- Plant L3 core -- Office L3
Cell B L2 (local) --/
```

**Design:** L2 **inside** cell; L3 between cells; no plant-wide VLAN. Residual: vendor cell remains a local blast radius—accepted and documented.

## Real-world — university dorms vs labs

**Dorms:** Frequent loops from consumer switches; L3 access (or tightly bounded L2 per stack) with BPDU guard.

**Research labs:** Some clusters need L2 next to NFS appliances.

| Building | Access model | Why |
|---|---|---|
| Dorms | L3 access / tiny L2 | Loop history, huge user count |
| Lecture | L3 to IDF | Roaming via wireless controller, not big VLAN |
| Lab wing | L2 in lab IDF only | Named cluster requirement ID |

**Requirement rewrite:** “Students roam” ≠ one flood domain across dorms. Wireless controller roam or L3 roam is enough.

## Migration notes

Moving L2→L3 access changes DHCP relays, GW addresses, firewall object groups, and sometimes NAC posture. Treat it as an **addressing and identity** project, not a weekend trunk change.

## Design checklist

1. Where is the first-hop gateway—and what fails when that box dies?
2. How large is each VLAN/VNI footprint in ports and buildings?
3. Which apps have a written L2 requirement ID?
4. Are uplinks routed with ECMP, or still STP/MLAG trunks?
5. Does wireless already remove the need for stretched user VLANs?

## Risks

- L3 access with accidental leftover stretched VLANs on trunks.
- L2 access with building-wide VLAN “for roaming.”
- OT cell VLAN trunked into the IT DC for “visibility.”
- FHRP pair as SPOF for hundreds of access VLANs with no dual dist.

## Interview framing

“I push L3 toward the access when I need small failure domains and ECMP. I keep L2 only where an application or a hard skill/time constraint demands it.”

## Related

- [L2 failure domains](01_L2_Failure_Domains.md)
- [STP and why to minimize L2](02_STP_and_Why_to_Minimize_L2.md)
- [MLAG, vPC, and multichassis](03_MLAG_vPC_and_Multichassis.md)
- [Hierarchical campus](../13_Campus_WAN_and_Edge/01_Hierarchical_Campus.md)

---
