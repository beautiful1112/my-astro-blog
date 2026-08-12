# Multicast design choices

Unicast cloning at the source does not scale. Multicast is a **replication and RPF** design.

| Choice | When |
|---|---|
| **SSM** | Source known (market data, some IPTV, many modern apps) |
| **ASM** | Dynamic sources, legacy, needs RP |
| **Bidir** | Many-to-many, no source tree state explosion |
| **No multicast** | App can unicast or overlay; WAN cannot support it |

Do not enable PIM “in case.” Overlay multicast (or app-level fanout) may be better across a WAN that cannot guarantee RPF.

Deep dive: [Multicast library](../../01_Multicast/Multicast_Deep_Dive.md).

## Interview framing

“I pick SSM when sources are known, ASM/Bidir only with an RP story, and I will refuse multicast across a WAN that cannot honor RPF.”

---
