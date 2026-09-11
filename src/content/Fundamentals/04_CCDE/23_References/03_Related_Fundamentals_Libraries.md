# Related Fundamentals libraries

Protocol depth is already in this site. Use CCDE notes for **when/why**; use these for **how it actually behaves**.

- [Multicast deep dive](../../01_Multicast/Multicast_Deep_Dive.md)
- [BGP deep dive](../../02_BGP/BGP_Deep_Dive.md)
- [EIGRP deep dive](../../03_EIGRP/EIGRP_Deep_Dive.md)
- [DC Fabric Field Guide](../../05_DC/01_Study_Roadmap/01_How_to_Use_This_Guide.md)

Especially: EIGRP stub/query, BGP RR and path attributes, multicast ASM/SSM/RPF. If those are fuzzy, CCDE technology selection will be guesswork.

## CCDE module → protocol note map

Jump to the protocol library when a CCDE design claim needs mechanism proof.

| CCDE area (this library) | Open in protocol libraries |
|---|---|
| [04 Planes and traffic flow](../04_Planes_and_Traffic_Flow/) | BGP session/transport; underlay IGP adjacency notes as needed |
| [05 Layer 2 design](../05_Layer2_Design/) | Multicast L2 snooping / flood behavior when L2 is unavoidable |
| [06 Routing protocol selection](../06_Routing_Protocol_Selection/) | EIGRP vs BGP scale notes; hub-spoke WAN modules |
| [07 OSPF design](../07_OSPF_Design/) | (OSPF depth lives in CCDE + vendor docs; pair with BGP at seams) |
| [08 IS-IS design](../08_ISIS_Design/) | Pair with BGP for Internet/WAN edge policy |
| [09 EIGRP and BGP design](../09_EIGRP_and_BGP_Design/) | [EIGRP query scope](../../03_EIGRP/09_Query_Scope_and_Convergence/README.md), [stub](../../03_EIGRP/11_Stub_Filtering_and_Split_Horizon/README.md), [summarization](../../03_EIGRP/10_Summarization/README.md); [BGP RR](../../02_BGP/13_Route_Reflection_and_Confederations/README.md), [path attributes](../../02_BGP/08_Path_Attributes/README.md), [communities](../../02_BGP/09_Communities/README.md) |
| [10 MPLS VPN and EVPN](../10_MPLS_VPN_and_EVPN/) | [MPLS L3VPN](../../02_BGP/18_MPLS_L3VPN/README.md), [MP-BGP](../../02_BGP/14_MP_BGP/README.md), [EVPN](../../02_BGP/19_EVPN/README.md) |
| [11 Multicast, QoS, transport](../11_Multicast_QoS_and_Transport/) | [ASM/SSM](../../01_Multicast/03_Service_Models_and_Terminology/02_ASM_and_SSM.md), [PIM](../../01_Multicast/08_PIM/README.md), [RPF](../../01_Multicast/07_RPF_and_Forwarding/README.md), [RP](../../01_Multicast/09_Rendezvous_Point/README.md) |
| [13 Campus, WAN, edge](../13_Campus_WAN_and_Edge/) | EIGRP WAN/NBMA; BGP multihoming / policy modules |
| [14 Data center and cloud](../14_Data_Center_and_Cloud/) | EVPN; multicast overlays when BUM matters; [DC fabric](../../05_DC/02_Reference_Architecture/README.md) |
| [15 HA and scale](../15_High_Availability_and_Scale/) | BGP convergence/resilience; EIGRP DUAL/feasibility |
| [19 Practical cases](../19_Practical_Cases/) | Matching troubleshooting / practical cases in each protocol tree |

## How to study the pair

1. Read the CCDE note for the **decision**.
2. Open one mapped protocol README and one deep note for the **mechanism**.
3. Write a three-line proof: requirement → design knob → protocol behavior that enforces it.
4. Do not binge entire protocol trees before a Practical sitting—pull only what the scenario needs.

## Quick “fuzzy → fix” list

| If this is fuzzy… | Start here |
|---|---|
| Query / SIA / stub | EIGRP query scope + stub overview |
| RR clusters / iBGP scale | BGP route reflection README |
| VPN labels / RT | BGP MPLS L3VPN + MP-BGP |
| EVPN control | BGP EVPN README |
| ASM vs SSM / RPF fail | Multicast service models + RPF |
| Path selection / TE-ish policy | BGP best path + communities + policy modules |
| WAN spoke scale | EIGRP WAN/NBMA + stub; then SD-WAN design in CCDE |

## Weekly pairing drill

Pick one CCDE note and one mapped protocol README. Speak for 90 seconds: requirement → knob → protocol proof → discarded anti-pattern. Log gaps; do not expand scope into unrelated chapters the same day.

## Related

- [Official CCDE blueprint](01_Official_CCDE_Blueprint.md)
- [Further reading](04_Further_Reading.md)

---
