# IP Multicast - Modular Deep-Dive Study Library

> **Audience:** Network-engineering and quantitative-trading infrastructure interviews  
> **Goal:** Understand packet behavior, control-plane state, design trade-offs, failure modes, and low-latency market-data applications—not merely configuration syntax.  
> **Revision:** 1.2 - 2026-07-26  
> **Structure:** 128 focused knowledge-point documents in 22 numbered modules.

The original monolithic guide has been divided so each topic can be studied, discussed, and revised independently.

## Recommended sequence

1. Modules 01-07: service model, membership, Layer 2, and RPF foundations.
2. Modules 08-10: PIM, RP mechanisms, and interdomain/overlay transport.
3. Modules 11-15: hosts, trading systems, security, observation, and troubleshooting.
4. Modules 16-22: cases, interview drills, labs, memorization, and references.

## Modules

### [01. Study roadmap](01_Study_Roadmap/README.md)

- [How to study multicast](01_Study_Roadmap/01_How_to_Study.md)
- [Learning objectives](01_Study_Roadmap/02_Learning_Objectives.md)

### [02. Essential mental model](02_Mental_Model/README.md)

- [What multicast is](02_Mental_Model/01_What_Multicast_Is.md)
- [The three multicast control planes](02_Mental_Model/02_Three_Control_Planes.md)
- [Receiver-driven signaling and data direction](02_Mental_Model/03_Receiver_Driven_Signaling.md)
- [End-to-end packet path](02_Mental_Model/04_End_to_End_Packet_Path.md)

### [03. Service models and terminology](03_Service_Models_and_Terminology/README.md)

- [Unicast, broadcast, anycast, and multicast](03_Service_Models_and_Terminology/01_Delivery_Models.md)
- [ASM and SSM](03_Service_Models_and_Terminology/02_ASM_and_SSM.md)
- [State and tree notation](03_Service_Models_and_Terminology/03_State_and_Tree_Notation.md)

### [04. Addressing and Layer-2 mapping](04_Addressing_and_Layer2_Mapping/README.md)

- [IPv4 multicast address space](04_Addressing_and_Layer2_Mapping/01_IPv4_Multicast_Address_Space.md)
- [Multicast scope and TTL](04_Addressing_and_Layer2_Mapping/02_Scope_and_TTL.md)
- [IPv4-to-Ethernet multicast mapping](04_Addressing_and_Layer2_Mapping/03_IPv4_Ethernet_Mapping.md)
- [IPv6 multicast addressing](04_Addressing_and_Layer2_Mapping/04_IPv6_Multicast_Addressing.md)
- [Well-known multicast control groups](04_Addressing_and_Layer2_Mapping/05_Well_Known_Control_Groups.md)

### [05. IGMP and MLD](05_IGMP_and_MLD/README.md)

- [What membership protocols do](05_IGMP_and_MLD/01_Membership_Protocol_Purpose.md)
- [IGMP wire facts](05_IGMP_and_MLD/02_IGMP_Wire_Facts.md)
- [IGMPv1, IGMPv2, and IGMPv3](05_IGMP_and_MLD/03_IGMP_Versions.md)
- [IGMP queries and timers](05_IGMP_and_MLD/04_Queries_and_Timers.md)
- [Querier election and the works-then-stops failure](05_IGMP_and_MLD/05_Querier_Election_and_Failure.md)
- [IGMP version compatibility](05_IGMP_and_MLD/06_Version_Compatibility.md)
- [MLD for IPv6](05_IGMP_and_MLD/07_MLD_for_IPv6.md)
- [Static joins and IGMP proxy](05_IGMP_and_MLD/08_Static_Joins_and_IGMP_Proxy.md)
- [IGMPv1 message format](05_IGMP_and_MLD/09_IGMPv1_Message_Format.md)
- [IGMPv2 message formats](05_IGMP_and_MLD/10_IGMPv2_Message_Formats.md)
- [IGMPv3 Membership Query format](05_IGMP_and_MLD/11_IGMPv3_Query_Format.md)
- [IGMPv3 Membership Report format](05_IGMP_and_MLD/12_IGMPv3_Report_Format.md)
- [IGMPv3 Group Record types](05_IGMP_and_MLD/13_IGMPv3_Group_Record_Types.md)
- [IGMPv3 socket state and interface-state merge](05_IGMP_and_MLD/14_IGMPv3_Socket_and_Interface_State.md)
- [IGMPv3 router-side listener state](05_IGMP_and_MLD/15_IGMPv3_Router_State.md)
- [IGMPv1 join, refresh, and leave process](05_IGMP_and_MLD/16_IGMPv1_Protocol_Process.md)
- [IGMPv2 join, query, and leave process](05_IGMP_and_MLD/17_IGMPv2_Protocol_Process.md)
- [IGMPv3 source-filter protocol process](05_IGMP_and_MLD/18_IGMPv3_Protocol_Process.md)
- [Report suppression in IGMP versions](05_IGMP_and_MLD/19_Report_Suppression.md)
- [IGMPv3 Max Resp Code and QQIC encoding](05_IGMP_and_MLD/20_IGMPv3_Timer_Code_Encoding.md)
- [IGMP packet-capture decoding workflow](05_IGMP_and_MLD/21_IGMP_Packet_Capture_Decoding.md)
- [MLDv1 message format](05_IGMP_and_MLD/22_MLDv1_Message_Format.md)
- [MLDv2 Query and Report formats](05_IGMP_and_MLD/23_MLDv2_Query_and_Report_Formats.md)
- [IGMP and MLD message-destination matrix](05_IGMP_and_MLD/24_IGMP_MLD_Destination_Matrix.md)
- [IGMPv3 report size, packing, and MTU behavior](05_IGMP_and_MLD/25_IGMPv3_Report_Size_and_MTU.md)
- [IGMP/MLD security and message validation](05_IGMP_and_MLD/26_IGMP_MLD_Security_and_Validation.md)

### [06. Layer-2 multicast and snooping](06_Layer2_Snooping/README.md)

- [Default Layer-2 multicast behavior](06_Layer2_Snooping/01_Default_Bridge_Behavior.md)
- [Snooping control terms](06_Layer2_Snooping/02_Snooping_Control_Terms.md)
- [Layer-2 leave processing](06_Layer2_Snooping/03_Leave_Processing.md)
- [Common Layer-2 multicast failures](06_Layer2_Snooping/04_Common_Snooping_Failures.md)
- [Layer-2 design for market data](06_Layer2_Snooping/05_Market_Data_L2_Design.md)

### [07. Multicast forwarding and RPF](07_RPF_and_Forwarding/README.md)

- [Why multicast needs RPF](07_RPF_and_Forwarding/01_Why_RPF_Is_Needed.md)
- [Reverse Path Forwarding check](07_RPF_and_Forwarding/02_RPF_Check.md)
- [MRIB selection and asymmetric paths](07_RPF_and_Forwarding/03_MRIB_and_Asymmetry.md)
- [Multicast RIB versus forwarding hardware](07_RPF_and_Forwarding/04_Control_Plane_vs_MFIB.md)
- [PIM Assert on shared LANs](07_RPF_and_Forwarding/05_PIM_Assert.md)

### [08. PIM modes and tree construction](08_PIM/README.md)

- [PIM control-plane facts](08_PIM/01_PIM_Control_Facts.md)
- [PIM Dense Mode](08_PIM/02_PIM_Dense_Mode.md)
- [PIM Sparse Mode complete flow](08_PIM/03_PIM_SM_Complete_Flow.md)
- [Reading PIM-SM state](08_PIM/04_Reading_PIM_SM_State.md)
- [PIM Source-Specific Multicast](08_PIM/05_PIM_SSM.md)
- [Bidirectional PIM](08_PIM/06_BIDIR_PIM.md)
- [Legacy multicast routing protocols](08_PIM/07_Legacy_Multicast_Routing.md)

### [09. Rendezvous Points and resilience](09_Rendezvous_Point/README.md)

- [Rendezvous Point purpose](09_Rendezvous_Point/01_RP_Purpose.md)
- [Group-to-RP mapping methods](09_Rendezvous_Point/02_RP_Mapping_Methods.md)
- [Anycast RP](09_Rendezvous_Point/03_Anycast_RP.md)
- [RP placement considerations](09_Rendezvous_Point/04_RP_Placement.md)

### [10. Interdomain multicast and overlays](10_Interdomain_and_Overlays/README.md)

- [Multicast Source Discovery Protocol](10_Interdomain_and_Overlays/01_MSDP.md)
- [Multiprotocol BGP for multicast](10_Interdomain_and_Overlays/02_MBGP.md)
- [Multicast VPNs over MPLS](10_Interdomain_and_Overlays/03_Multicast_VPNs.md)
- [Multicast with VXLAN and EVPN](10_Interdomain_and_Overlays/04_VXLAN_and_EVPN.md)
- [Public cloud and virtualization](10_Interdomain_and_Overlays/05_Cloud_and_Virtualization.md)

### [11. Host, transport, and application behavior](11_Host_and_Application/README.md)

- [UDP and multicast](11_Host_and_Application/01_UDP_and_Multicast.md)
- [Multicast socket operations](11_Host_and_Application/02_Socket_Operations.md)
- [Minimal Python multicast lab](11_Host_and_Application/03_Python_Lab_Receiver_and_Sender.md)
- [Binding and multiple receiver processes](11_Host_and_Application/04_Binding_and_Multiple_Receivers.md)
- [NIC receive path](11_Host_and_Application/05_NIC_Receive_Path.md)
- [Low-latency host considerations](11_Host_and_Application/06_Low_Latency_Host_Tuning.md)
- [MTU and fragmentation](11_Host_and_Application/07_MTU_and_Fragmentation.md)
- [Reliability above IP multicast](11_Host_and_Application/08_Application_Reliability.md)

### [12. Quantitative-trading market data](12_Quant_Trading_Market_Data/README.md)

- [Why exchanges use multicast](12_Quant_Trading_Market_Data/01_Why_Exchanges_Use_Multicast.md)
- [Typical market-data architecture](12_Quant_Trading_Market_Data/02_Typical_Feed_Architecture.md)
- [A/B line arbitration](12_Quant_Trading_Market_Data/03_AB_Line_Arbitration.md)
- [Loss versus latency in trading](12_Quant_Trading_Market_Data/04_Loss_vs_Latency.md)
- [Multicast capacity math](12_Quant_Trading_Market_Data/05_Capacity_Math.md)
- [QoS and congestion](12_Quant_Trading_Market_Data/06_QoS_and_Congestion.md)
- [LAG and ECMP considerations](12_Quant_Trading_Market_Data/07_LAG_and_ECMP.md)
- [Low-latency multicast design pattern](12_Quant_Trading_Market_Data/08_Low_Latency_Design_Pattern.md)

### [13. Security and operational controls](13_Security/README.md)

- [Multicast security threats](13_Security/01_Threats.md)
- [Multicast security controls](13_Security/02_Controls.md)
- [The three-level boundary principle](13_Security/03_Boundary_Principle.md)

### [14. Configuration and observation](14_Configuration_and_Observation/README.md)

- [Linux multicast inspection](14_Configuration_and_Observation/01_Linux_Inspection.md)
- [Router and switch state to inspect](14_Configuration_and_Observation/02_Network_Device_State.md)
- [Minimal PIM-SSM configuration pattern](14_Configuration_and_Observation/03_PIM_SSM_Config_Pattern.md)
- [Minimal PIM-SM ASM configuration pattern](14_Configuration_and_Observation/04_PIM_SM_ASM_Config_Pattern.md)
- [Safe multicast testing tools](14_Configuration_and_Observation/05_Testing_Tools.md)

### [15. Deterministic troubleshooting](15_Troubleshooting/README.md)

- [Define the exact multicast flow](15_Troubleshooting/01_Define_the_Flow.md)
- [Follow control state from receiver upstream](15_Troubleshooting/02_Control_State_From_Receiver.md)
- [Follow data from source downstream](15_Troubleshooting/03_Data_From_Source.md)
- [Multicast symptom matrix](15_Troubleshooting/04_Symptom_Matrix.md)
- [Packet-capture interpretation](15_Troubleshooting/05_Packet_Capture.md)
- [Debugging multicast microbursts](15_Troubleshooting/06_Microburst_Debugging.md)

### [16. Practical cases](16_Practical_Cases/README.md)

- [Case 1: Same-VLAN multicast with no router](16_Practical_Cases/01_Same_VLAN_No_Router.md)
- [Case 2: SSM across routed receiver VLANs](16_Practical_Cases/02_SSM_Across_VLANs.md)
- [Case 3: RPF failure after a route change](16_Practical_Cases/03_RPF_Failure_After_Route_Change.md)
- [Case 4: Existing ASM data survives RP failure](16_Practical_Cases/04_ASM_After_RP_Failure.md)
- [Case 5: One receiver leaves and others disappear](16_Practical_Cases/05_Fast_Leave_Blackhole.md)
- [Case 6: Capture sees packets but the application reports gaps](16_Practical_Cases/06_Capture_Sees_Data_Application_Gaps.md)
- [Case 7: A and B feeds fail together](16_Practical_Cases/07_AB_Feeds_Fail_Together.md)
- [Case 8: Wrong multicast MAC calculation](16_Practical_Cases/08_Wrong_Multicast_MAC.md)
- [Case 9: TTL confusion](16_Practical_Cases/09_TTL_Confusion.md)
- [Case 10: Sequence gap without packet loss](16_Practical_Cases/10_False_Sequence_Gap.md)

### [17. Interview questions](17_Interview_Questions/README.md)

- [Interview questions: fundamentals](17_Interview_Questions/01_Fundamentals.md)
- [Interview questions: membership and Layer 2](17_Interview_Questions/02_Membership_and_Layer2.md)
- [Interview questions: PIM and RP](17_Interview_Questions/03_PIM_and_RP.md)
- [Interview questions: trading and performance](17_Interview_Questions/04_Trading_and_Performance.md)
- [Interview questions: troubleshooting](17_Interview_Questions/05_Troubleshooting.md)

### [18. Labs and mastery exercises](18_Labs/README.md)

- [Lab 1: Ethernet mapping](18_Labs/01_Ethernet_Mapping.md)
- [Lab 2: Membership lifecycle](18_Labs/02_Membership_Lifecycle.md)
- [Lab 3: No-querier failure](18_Labs/03_No_Querier.md)
- [Lab 4: Routed SSM](18_Labs/04_Routed_SSM.md)
- [Lab 5: PIM-SM phases](18_Labs/05_PIM_SM_Phases.md)
- [Lab 6: Application gap recovery](18_Labs/06_Gap_Recovery.md)
- [Lab 7: Host bottleneck](18_Labs/07_Host_Bottleneck.md)
- [Design exercise](18_Labs/08_Design_Exercise.md)

### [19. Memorization sheets](19_Memorization/README.md)

- [Numbers to memorize](19_Memorization/01_Numbers.md)
- [One-sentence recall](19_Memorization/02_One_Sentence_Recall.md)
- [Five-step interview narrative](19_Memorization/03_Five_Step_Narrative.md)

### [20. Common misconceptions](20_Common_Misconceptions/README.md)

- [Common multicast misconceptions](20_Common_Misconceptions/01_Common_Misconceptions.md)

### [21. Primary references](21_References/README.md)

- [Core multicast standards](21_References/01_Core_Standards.md)
- [RP, interdomain, and diagnostic references](21_References/02_RP_Interdomain_and_Diagnostics.md)
- [Registries and implementation guidance](21_References/03_Registries_and_Implementation.md)
- [Primary market-data specifications](21_References/04_Market_Data_Specifications.md)

### [22. Follow-up discussions](22_Follow_Up/README.md)

- [Follow-up discussion prompts](22_Follow_Up/01_Discussion_Prompts.md)

## Maintenance convention

- Update the smallest document that owns the knowledge point.
- Add cross-links when a change affects another topic.
- Keep standards and venue details tied to Module 21 primary references.
- Increment the revision for major structural changes.
