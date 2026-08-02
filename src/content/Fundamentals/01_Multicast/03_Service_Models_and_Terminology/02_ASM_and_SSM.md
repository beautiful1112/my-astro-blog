# ASM and SSM

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Any-Source Multicast

A receiver requests `G`, represented by `(*,G)`, and accepts any source. PIM-SM uses an RP so sources and receivers can discover each other. ASM supports many-to-many communication but adds RP/shared-tree complexity and permits unwanted sources unless policy blocks them.

## Source-Specific Multicast

A receiver requests `(S,G)`. Source discovery, RP, Registers, and MSDP are unnecessary; the tree is built directly toward `S`. SSM is usually preferred when receivers can be provisioned with a source address, as in controlled market-data plants.

| Property | ASM | SSM |
|---|---|---|
| Receiver request | `G` / `(*,G)` | `(S,G)` |
| Source discovery | RP and possibly MSDP | out-of-band configuration |
| Host signaling | IGMPv2 sufficient for group-only interest | IGMPv3 or MLDv2 source filtering |
| Tree | RPT, optionally SPT | source-rooted SPT |
| Complexity | higher | lower |

