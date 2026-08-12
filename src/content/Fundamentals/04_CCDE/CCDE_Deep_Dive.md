# CCDE - Modular Design Study Library

> **Audience:** CCDE Written (400-007) v3.1, CCDE Practical, and design interviews  
> **Goal:** Think like a designer—map business to constraints, choose technologies with explicit trade-offs, and defend a design under failure, scale, security, and operations—not memorize CLI.  
> **Revision:** 1.0 - 2026-08-12  
> **Structure:** Focused knowledge-point documents in 24 numbered modules (practical cases, interview drills, memorization, misconceptions, and references included).

These notes are **original study material** aligned to the public [Cisco CCDE v3.1 unified exam topics](https://learningnetwork.cisco.com/s/ccde-v3-1-unified-exam-topics) and classic enterprise/SP design practice. They are **not** a reproduction of any commercial book. Protocol mechanics already live in [Multicast](../01_Multicast/Multicast_Deep_Dive.md), [BGP](../02_BGP/BGP_Deep_Dive.md), and [EIGRP](../03_EIGRP/EIGRP_Deep_Dive.md)—this library asks *when and why* those tools belong in a design.

Each topic is a separate document so it can be studied, discussed, tested, and revised independently.

## Recommended sequence

1. Modules 01-04: how CCDE is examined, design mindset, business mapping, and planes.
2. Modules 05-12: L2, IGP/BGP selection, MPLS/EVPN, multicast/QoS, and addressing.
3. Modules 13-17: campus/WAN/edge, DC/cloud, HA/scale, security, automation/observability.
4. Module 18: migration and Practical exam method.
5. Module 19: original design cases.
6. Modules 20-24: interview drills, memorization, misconceptions, references, follow-up.

## Modules

### [01. Study roadmap](01_Study_Roadmap/README.md)

- [How to study CCDE](01_Study_Roadmap/01_How_to_Study_CCDE.md)
- [CCDE learning objectives](01_Study_Roadmap/02_Learning_Objectives.md)
- [Written versus Practical](01_Study_Roadmap/03_Written_vs_Practical.md)
- [CCDE versus CCIE](01_Study_Roadmap/04_CCDE_vs_CCIE.md)

### [02. Design mindset](02_Design_Mindset/README.md)

- [What CCDE is](02_Design_Mindset/01_What_CCDE_Is.md)
- [Design is not implementation](02_Design_Mindset/02_Design_Is_Not_Implementation.md)
- [Requirements, constraints, assumptions](02_Design_Mindset/03_Requirements_Constraints_Assumptions.md)
- [Trade-off thinking](02_Design_Mindset/04_Trade_Off_Thinking.md)
- [HLD versus LLD](02_Design_Mindset/05_HLD_vs_LLD.md)
- [How to defend a design](02_Design_Mindset/06_How_to_Defend_a_Design.md)
- [Core CCDE terminology](02_Design_Mindset/07_Core_CCDE_Terminology.md)

### [03. Business strategy](03_Business_Strategy/README.md)

- [Business to technical mapping](03_Business_Strategy/01_Business_to_Technical_Mapping.md)
- [Waterfall versus Agile](03_Business_Strategy/02_Waterfall_vs_Agile.md)
- [RPO, RTO, ROI, and cost](03_Business_Strategy/03_RPO_RTO_ROI_and_Cost.md)
- [Risk, reward, and continuity](03_Business_Strategy/04_Risk_Reward_and_Continuity.md)
- [Environmental sustainability](03_Business_Strategy/05_Sustainability.md)
- [AI/ML as a business driver](03_Business_Strategy/06_AI_ML_as_Business_Driver.md)
- [Data sovereignty and governance](03_Business_Strategy/07_Data_Sovereignty_and_Governance.md)

### [04. Planes and traffic flow](04_Planes_and_Traffic_Flow/README.md)

- [Control, data, and management planes](04_Planes_and_Traffic_Flow/01_Control_Data_Management_Planes.md)
- [End-to-end IP traffic flow](04_Planes_and_Traffic_Flow/02_End_to_End_IP_Traffic_Flow.md)
- [Centralized versus distributed control](04_Planes_and_Traffic_Flow/03_Centralized_vs_Distributed_Control.md)
- [Overlay, underlay, and fabric](04_Planes_and_Traffic_Flow/04_Overlay_Underlay_and_Fabric.md)
- [Policy and orchestration planes](04_Planes_and_Traffic_Flow/05_Policy_and_Orchestration_Planes.md)

### [05. Layer 2 design](05_Layer2_Design/README.md)

- [L2 failure domains](05_Layer2_Design/01_L2_Failure_Domains.md)
- [STP and why to minimize L2](05_Layer2_Design/02_STP_and_Why_to_Minimize_L2.md)
- [MLAG, vPC, and multichassis](05_Layer2_Design/03_MLAG_vPC_and_Multichassis.md)
- [L2 versus L3 at the access](05_Layer2_Design/04_L2_vs_L3_Access.md)
- [VLAN and broadcast design](05_Layer2_Design/05_VLAN_and_Broadcast_Design.md)

### [06. Routing protocol selection](06_Routing_Protocol_Selection/README.md)

- [Choosing an IGP](06_Routing_Protocol_Selection/01_Choosing_an_IGP.md)
- [Hierarchy and summarization](06_Routing_Protocol_Selection/02_Hierarchy_and_Summarization.md)
- [Redistribution as a design smell](06_Routing_Protocol_Selection/03_Redistribution_as_a_Design_Smell.md)
- [Fast convergence design](06_Routing_Protocol_Selection/04_Fast_Convergence_Design.md)
- [Hub-spoke versus mesh](06_Routing_Protocol_Selection/05_Hub_Spoke_vs_Mesh.md)

### [07. OSPF design](07_OSPF_Design/README.md)

- [OSPF area design](07_OSPF_Design/01_OSPF_Area_Design.md)
- [ABR and ASBR placement](07_OSPF_Design/02_ABR_and_ASBR_Placement.md)
- [Stub and NSSA as design tools](07_OSPF_Design/03_Stub_NSSA_as_Design_Tools.md)
- [Summarization and suboptimal routing](07_OSPF_Design/04_Summarization_and_Suboptimal_Routing.md)
- [OSPF mesh and hub-spoke](07_OSPF_Design/05_OSPF_Topologies_Mesh_and_Hub_Spoke.md)

### [08. IS-IS design](08_ISIS_Design/README.md)

- [IS-IS versus OSPF for design](08_ISIS_Design/01_ISIS_vs_OSPF_for_Design.md)
- [Levels and L1/L2 placement](08_ISIS_Design/02_Levels_and_L1L2_Placement.md)
- [IS-IS for SP and MPLS](08_ISIS_Design/03_ISIS_for_SP_and_MPLS.md)
- [OSPF to IS-IS migration](08_ISIS_Design/04_OSPF_to_ISIS_Migration.md)

### [09. EIGRP and BGP design](09_EIGRP_and_BGP_Design/README.md)

- [EIGRP as enterprise IGP](09_EIGRP_and_BGP_Design/01_EIGRP_as_Enterprise_IGP.md)
- [Query bounding in design](09_EIGRP_and_BGP_Design/02_Query_Bounding_in_Design.md)
- [When the enterprise needs BGP](09_EIGRP_and_BGP_Design/03_When_Enterprise_Needs_BGP.md)
- [iBGP scale: RR and confederations](09_EIGRP_and_BGP_Design/04_iBGP_Scale_RR_and_Confederations.md)
- [eBGP edge and policy](09_EIGRP_and_BGP_Design/05_eBGP_Edge_and_Policy.md)

### [10. MPLS, VPN, and EVPN](10_MPLS_VPN_and_EVPN/README.md)

- [Why MPLS exists](10_MPLS_VPN_and_EVPN/01_Why_MPLS_Exists.md)
- [L3VPN versus L2VPN](10_MPLS_VPN_and_EVPN/02_L3VPN_vs_L2VPN.md)
- [VPN topologies](10_MPLS_VPN_and_EVPN/03_VPN_Topologies.md)
- [EVPN as unified control](10_MPLS_VPN_and_EVPN/04_EVPN_as_Unified_Control.md)
- [Segment routing in design](10_MPLS_VPN_and_EVPN/05_Segment_Routing_in_Design.md)

### [11. Multicast, QoS, and transport](11_Multicast_QoS_and_Transport/README.md)

- [Multicast design choices](11_Multicast_QoS_and_Transport/01_Multicast_Design_Choices.md)
- [RP placement](11_Multicast_QoS_and_Transport/02_RP_Placement.md)
- [QoS as a design problem](11_Multicast_QoS_and_Transport/03_QoS_as_a_Design_Problem.md)
- [DiffServ end to end](11_Multicast_QoS_and_Transport/04_DiffServ_End_to_End.md)
- [TCP, UDP, and QUIC implications](11_Multicast_QoS_and_Transport/05_TCP_UDP_QUIC_Implications.md)

### [12. IPv6 and addressing](12_IPv6_and_Addressing/README.md)

- [Addressing as architecture](12_IPv6_and_Addressing/01_Addressing_as_Architecture.md)
- [IPv6 transition strategies](12_IPv6_and_Addressing/02_IPv6_Transition_Strategies.md)
- [Dual-stack design](12_IPv6_and_Addressing/03_Dual_Stack_Design.md)
- [Summarizable address plans](12_IPv6_and_Addressing/04_Summarizable_Address_Plans.md)

### [13. Campus, WAN, and edge](13_Campus_WAN_and_Edge/README.md)

- [Hierarchical campus](13_Campus_WAN_and_Edge/01_Hierarchical_Campus.md)
- [WAN topologies](13_Campus_WAN_and_Edge/02_WAN_Topologies.md)
- [SD-WAN design](13_Campus_WAN_and_Edge/03_SD_WAN_Design.md)
- [Internet edge and multihoming](13_Campus_WAN_and_Edge/04_Internet_Edge_and_Multihoming.md)
- [Cloud OnRamp](13_Campus_WAN_and_Edge/05_Cloud_OnRamp.md)

### [14. Data center and cloud](14_Data_Center_and_Cloud/README.md)

- [Leaf-spine versus three-tier](14_Data_Center_and_Cloud/01_Leaf_Spine_vs_Three_Tier.md)
- [VXLAN EVPN data center](14_Data_Center_and_Cloud/02_VXLAN_EVPN_DC.md)
- [DCI patterns](14_Data_Center_and_Cloud/03_DCI_Patterns.md)
- [Cloud and hybrid placement](14_Data_Center_and_Cloud/04_Cloud_Hybrid_Placement.md)
- [AI fabric design notes](14_Data_Center_and_Cloud/05_AI_Fabric_Design_Notes.md)

### [15. High availability and scale](15_High_Availability_and_Scale/README.md)

- [Failure domains](15_High_Availability_and_Scale/01_Failure_Domains.md)
- [RTO/RPO to HA mapping](15_High_Availability_and_Scale/02_RTO_RPO_to_HA_Mapping.md)
- [FHRP, NSF, GR, and BFD](15_High_Availability_and_Scale/03_FHRP_NSF_GR_BFD.md)
- [Fate sharing](15_High_Availability_and_Scale/04_Fate_Sharing.md)
- [Scale limits and modularity](15_High_Availability_and_Scale/05_Scale_Limits_and_Modularity.md)

### [16. Security design](16_Security_Design/README.md)

- [CIA triad in design](16_Security_Design/01_CIA_Triad_in_Design.md)
- [Segmentation](16_Security_Design/02_Segmentation.md)
- [NAC and zero trust](16_Security_Design/03_NAC_and_Zero_Trust.md)
- [Policy enforcement points](16_Security_Design/04_Policy_Enforcement_Points.md)
- [Regulatory and AI security](16_Security_Design/05_Regulatory_and_AI_Security.md)

### [17. Automation and observability](17_Automation_and_Observability/README.md)

- [Controller-based design](17_Automation_and_Observability/01_Controller_Based_Design.md)
- [APIs and model-driven management](17_Automation_and_Observability/02_APIs_and_Model_Driven.md)
- [CI/CD for the network](17_Automation_and_Observability/03_CI_CD_for_Network.md)
- [Visibility, observability, and assurance](17_Automation_and_Observability/04_Visibility_Observability_Assurance.md)
- [User and application experience](17_Automation_and_Observability/05_User_and_Application_Experience.md)

### [18. Migration and Practical method](18_Migration_and_Practical_Method/README.md)

- [Implementation and migration plans](18_Migration_and_Practical_Method/01_Implementation_and_Migration_Plans.md)
- [How to read a scenario](18_Migration_and_Practical_Method/02_How_to_Read_a_Scenario.md)
- [Extract requirements](18_Migration_and_Practical_Method/03_Extract_Requirements.md)
- [Compare and justify](18_Migration_and_Practical_Method/04_Compare_and_Justify.md)
- [Practical time and traps](18_Migration_and_Practical_Method/05_Practical_Time_and_Traps.md)

### [19. Practical cases](19_Practical_Cases/README.md)

- [Campus L2 explosion](19_Practical_Cases/01_Campus_L2_Explosion.md)
- [WAN hub as single point of failure](19_Practical_Cases/02_WAN_Hub_SPOF.md)
- [Mutual redistribution loop](19_Practical_Cases/03_Mutual_Redistribution_Loop.md)
- [Cloud exit without sovereignty](19_Practical_Cases/04_Cloud_Exit_Without_Sovereignty.md)
- [SD-WAN overlay without underlay](19_Practical_Cases/05_SDWAN_Without_Underlay.md)
- [DC stretch that shared fate](19_Practical_Cases/06_DC_Stretch_Shared_Fate.md)

### [20. Interview questions](20_Interview_Questions/README.md)

- [Mindset and business](20_Interview_Questions/01_Mindset_and_Business.md)
- [Planes and control](20_Interview_Questions/02_Planes_and_Control.md)
- [IGP and BGP design](20_Interview_Questions/03_IGP_and_BGP_Design.md)
- [WAN, DC, and cloud](20_Interview_Questions/04_WAN_DC_and_Cloud.md)
- [Security and automation](20_Interview_Questions/05_Security_and_Automation.md)

### [21. Memorization](21_Memorization/README.md)

- [CCDE core facts](21_Memorization/01_CCDE_Core_Facts.md)
- [Blueprint domain card](21_Memorization/02_Blueprint_Domain_Card.md)
- [Technology selection card](21_Memorization/03_Technology_Selection_Card.md)
- [HA and failure-domain card](21_Memorization/04_HA_and_Failure_Domain_Card.md)
- [Practical exam method card](21_Memorization/05_Practical_Exam_Method_Card.md)

### [22. Common misconceptions](22_Common_Misconceptions/README.md)

- [More redundancy is always better](22_Common_Misconceptions/01_More_Redundancy_Is_Always_Better.md)
- [Best protocol wins](22_Common_Misconceptions/02_Best_Protocol_Wins.md)
- [HLD is just a pretty drawing](22_Common_Misconceptions/03_HLD_Is_Just_a_Pretty_Drawing.md)
- [Cloud removes network design](22_Common_Misconceptions/04_Cloud_Removes_Network_Design.md)
- [Automation replaces architecture](22_Common_Misconceptions/05_Automation_Replaces_Architecture.md)

### [23. References](23_References/README.md)

- [Official CCDE blueprint](23_References/01_Official_CCDE_Blueprint.md)
- [Design RFCs and architecture docs](23_References/02_Design_RFCs_and_Architecture.md)
- [Related Fundamentals libraries](23_References/03_Related_Fundamentals_Libraries.md)
- [Further reading](23_References/04_Further_Reading.md)

### [24. Follow-up](24_Follow_Up/README.md)

What to study next, open questions, and how to keep this library alive after incidents and labs.
