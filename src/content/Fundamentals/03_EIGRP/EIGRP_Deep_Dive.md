# EIGRP - Modular Deep-Dive Study Library

> **Audience:** Network-engineering interviews and Cisco enterprise WAN/campus operations  
> **Goal:** Master EIGRP neighbors and RTP, DUAL (FD/RD/FC), metrics/K-values/wide metrics, query scope (stub/summary), variance/UCMP, named mode and IPv6, redistribution/AD, authentication, WAN design, and deterministic troubleshooting—not merely CLI syntax.  
> **Revision:** 1.0 - 2026-08-10  
> **Structure:** 174 focused knowledge-point documents in 27 numbered modules (interview drills, labs, memorization, misconceptions, and references included).

Each topic is a separate document so it can be studied, discussed, tested, and revised independently.

## Recommended sequence

1. Modules 01-07: mental model, process/AF, packets/RTP, neighbors, topology/RIB, and metrics.
2. Modules 08-14: DUAL, query scope, summarization, stub/filtering, load balancing, named mode, and IPv6.
3. Modules 15-20: redistribution/AD, auth, WAN/NBMA/DMVPN, scale/design, operations, and troubleshooting.
4. Module 21: practical failure cases.
5. Modules 22-27: interview drills, labs, memorization, misconceptions, references, and follow-up.

## Modules

### [01. Study roadmap](01_Study_Roadmap/README.md)

- [How to study EIGRP](01_Study_Roadmap/01_How_to_Study_EIGRP.md)
- [EIGRP learning objectives](01_Study_Roadmap/02_Learning_Objectives.md)

### [02. Fundamentals](02_Fundamentals/README.md)

- [What EIGRP is](02_Fundamentals/01_What_EIGRP_Is.md)
- [Why EIGRP exists](02_Fundamentals/02_Why_EIGRP_Exists.md)
- [Advanced distance vector](02_Fundamentals/03_Advanced_Distance_Vector.md)
- [Control plane versus data plane](02_Fundamentals/04_Control_Plane_vs_Data_Plane.md)
- [Core EIGRP terminology](02_Fundamentals/05_Core_Terminology.md)
- [EIGRP vs OSPF vs IS-IS](02_Fundamentals/06_EIGRP_vs_OSPF_vs_IS_IS.md)

### [03. Process and address families](03_Process_and_Address_Families/README.md)

- [AS number in EIGRP](03_Process_and_Address_Families/01_AS_Number_in_EIGRP.md)
- [Classic versus named mode](03_Process_and_Address_Families/02_Classic_vs_Named_Mode.md)
- [Address families overview](03_Process_and_Address_Families/03_Address_Families_Overview.md)
- [Router ID](03_Process_and_Address_Families/04_Router_ID.md)
- [VRF-aware EIGRP](03_Process_and_Address_Families/05_VRF_Aware_EIGRP.md)

### [04. Packets and transport](04_Packets_and_Transport/README.md)

- [IP protocol 88 and RTP](04_Packets_and_Transport/01_IP_Protocol_88_and_RTP.md)
- [Packet types overview](04_Packets_and_Transport/02_Packet_Types_Overview.md)
- [Hello and Hold](04_Packets_and_Transport/03_Hello_and_Hold.md)
- [Update packets](04_Packets_and_Transport/04_Update_Packets.md)
- [Query and Reply](04_Packets_and_Transport/05_Query_and_Reply.md)
- [ACK and reliable delivery](04_Packets_and_Transport/06_ACK_and_Reliable_Delivery.md)
- [SIA-Query and SIA-Reply](04_Packets_and_Transport/07_SIA_Query_and_SIA_Reply.md)
- [Multicast addresses](04_Packets_and_Transport/08_Multicast_Addresses.md)

### [05. Neighbor discovery](05_Neighbor_Discovery/README.md)

- [Neighbor formation requirements](05_Neighbor_Discovery/01_Neighbor_Formation_Requirements.md)
- [Hello interval and Hold Time](05_Neighbor_Discovery/02_Hello_Interval_and_Hold_Time.md)
- [Neighbor table](05_Neighbor_Discovery/03_Neighbor_Table.md)
- [Static neighbors](05_Neighbor_Discovery/04_Static_Neighbors.md)
- [Passive interfaces](05_Neighbor_Discovery/05_Passive_Interfaces.md)
- [Neighbor adjacency lifecycle](05_Neighbor_Discovery/06_Neighbor_Adjacency_Lifecycle.md)
- [Common neighbor mismatches](05_Neighbor_Discovery/07_Common_Neighbor_Mismatches.md)

### [06. Topology table and RIB](06_Topology_Table_and_RIB/README.md)

- [Three EIGRP tables](06_Topology_Table_and_RIB/01_Three_EIGRP_Tables.md)
- [Topology table entries](06_Topology_Table_and_RIB/02_Topology_Table_Entries.md)
- [Successor and feasible successor](06_Topology_Table_and_RIB/03_Successor_and_Feasible_Successor.md)
- [Passive versus Active routes](06_Topology_Table_and_RIB/04_Passive_vs_Active_Routes.md)
- [Installing into the RIB](06_Topology_Table_and_RIB/05_Installing_into_RIB.md)
- [Reading show EIGRP topology](06_Topology_Table_and_RIB/06_Reading_Show_EIGRP_Topology.md)

### [07. Metrics and K-values](07_Metrics_and_K_Values/README.md)

- [Composite metric formula](07_Metrics_and_K_Values/01_Composite_Metric_Formula.md)
- [Bandwidth and delay components](07_Metrics_and_K_Values/02_Bandwidth_and_Delay_Components.md)
- [Reliability, load, and MTU](07_Metrics_and_K_Values/03_Reliability_Load_and_MTU.md)
- [K-values and mismatch](07_Metrics_and_K_Values/04_K_Values_and_Mismatch.md)
- [Wide metrics](07_Metrics_and_K_Values/05_Wide_Metrics.md)
- [Interface bandwidth and delay tuning](07_Metrics_and_K_Values/06_Interface_Bandwidth_Delay_Tuning.md)
- [Metric calculation worked example](07_Metrics_and_K_Values/07_Metric_Calculation_Worked_Example.md)

### [08. DUAL and feasibility](08_DUAL_and_Feasibility/README.md)

- [DUAL overview](08_DUAL_and_Feasibility/01_DUAL_Overview.md)
- [Reported Distance and Feasible Distance](08_DUAL_and_Feasibility/02_Reported_Distance_and_Feasible_Distance.md)
- [Feasibility Condition](08_DUAL_and_Feasibility/03_Feasibility_Condition.md)
- [Successor selection](08_DUAL_and_Feasibility/04_Successor_Selection.md)
- [Feasible successor and local repair](08_DUAL_and_Feasibility/05_Feasible_Successor_and_Local_Repair.md)
- [Going Active and Queries](08_DUAL_and_Feasibility/06_Going_Active_and_Queries.md)
- [Reply processing and new successor](08_DUAL_and_Feasibility/07_Reply_Processing_and_New_Successor.md)
- [Stuck-in-Active](08_DUAL_and_Feasibility/08_Stuck_in_Active.md)

### [09. Query scope and convergence](09_Query_Scope_and_Convergence/README.md)

- [Query propagation](09_Query_Scope_and_Convergence/01_Query_Propagation.md)
- [How Replies bound the computation](09_Query_Scope_and_Convergence/02_How_Replies_Bound_the_Computation.md)
- [Stub as a query boundary](09_Query_Scope_and_Convergence/03_Stub_as_Query_Boundary.md)
- [Summarization as a query boundary](09_Query_Scope_and_Convergence/04_Summarization_as_Query_Boundary.md)
- [Convergence timeline](09_Query_Scope_and_Convergence/05_Convergence_Timeline.md)
- [Designing the query domain](09_Query_Scope_and_Convergence/06_Designing_the_Query_Domain.md)

### [10. Summarization](10_Summarization/README.md)

- [Why summarize in EIGRP](10_Summarization/01_Why_Summarize_in_EIGRP.md)
- [Auto-summary (legacy)](10_Summarization/02_Auto_Summary_Legacy.md)
- [Interface summarization](10_Summarization/03_Interface_Summarization.md)
- [Null0 discard route](10_Summarization/04_Null0_Discard_Route.md)
- [Summary metric and component min](10_Summarization/05_Summary_Metric_and_Component_Min.md)
- [Leak maps and specifics](10_Summarization/06_Leak_Maps_and_Specifics.md)
- [Summarization and query reduction](10_Summarization/07_Summarization_and_Query_Reduction.md)

### [11. Stub, filtering, and split horizon](11_Stub_Filtering_and_Split_Horizon/README.md)

- [EIGRP stub overview](11_Stub_Filtering_and_Split_Horizon/01_EIGRP_Stub_Overview.md)
- [Stub options](11_Stub_Filtering_and_Split_Horizon/02_Stub_Options.md)
- [Stub in hub and spoke](11_Stub_Filtering_and_Split_Horizon/03_Stub_in_Hub_and_Spoke.md)
- [Distribute lists and prefix lists](11_Stub_Filtering_and_Split_Horizon/04_Distribute_Lists_and_Prefix_Lists.md)
- [Offset lists](11_Stub_Filtering_and_Split_Horizon/05_Offset_Lists.md)
- [Split horizon](11_Stub_Filtering_and_Split_Horizon/06_Split_Horizon.md)
- [Route maps with EIGRP](11_Stub_Filtering_and_Split_Horizon/07_Route_Maps_with_EIGRP.md)

### [12. Load balancing](12_Load_Balancing/README.md)

- [Equal-cost multipath](12_Load_Balancing/01_Equal_Cost_Multipath.md)
- [Variance unequal-cost](12_Load_Balancing/02_Variance_Unequal_Cost.md)
- [Maximum paths](12_Load_Balancing/03_Maximum_Paths.md)
- [Traffic-share balanced versus min](12_Load_Balancing/04_Traffic_Share_Balanced_vs_Min.md)
- [UCMP worked example](12_Load_Balancing/05_UCMP_Worked_Example.md)
- [UCMP pitfalls](12_Load_Balancing/06_UCMP_Pitfalls.md)

### [13. Named mode and configuration](13_Named_Mode_and_Configuration/README.md)

- [Named mode structure](13_Named_Mode_and_Configuration/01_Named_Mode_Structure.md)
- [Classic AS mode recap](13_Named_Mode_and_Configuration/02_Classic_AS_Mode_Recap.md)
- [AF-interface configuration](13_Named_Mode_and_Configuration/03_AF_Interface_Configuration.md)
- [Topology base and VRF](13_Named_Mode_and_Configuration/04_Topology_Base_and_VRF.md)
- [Migrating classic to named](13_Named_Mode_and_Configuration/05_Migrating_Classic_to_Named.md)
- [Minimal working configs](13_Named_Mode_and_Configuration/06_Minimal_Working_Configs.md)

### [14. IPv6 EIGRP](14_IPv6_EIGRP/README.md)

- [EIGRP for IPv6 fundamentals](14_IPv6_EIGRP/01_EIGRP_for_IPv6_Fundamentals.md)
- [Router ID requirement](14_IPv6_EIGRP/02_Router_ID_Requirement.md)
- [Named mode IPv6](14_IPv6_EIGRP/03_Named_Mode_IPv6.md)
- [Classic IPv6 router EIGRP](14_IPv6_EIGRP/04_Classic_IPv6_Router_EIGRP.md)
- [Dual-stack design notes](14_IPv6_EIGRP/05_Dual_Stack_Design_Notes.md)
- [IPv6 verification](14_IPv6_EIGRP/06_IPv6_Verification.md)

### [15. Redistribution and AD](15_Redistribution_and_AD/README.md)

- [Administrative distances](15_Redistribution_and_AD/01_Administrative_Distances.md)
- [Redistributing into EIGRP](15_Redistribution_and_AD/02_Redistributing_into_EIGRP.md)
- [Redistributing from EIGRP](15_Redistribution_and_AD/03_Redistributing_from_EIGRP.md)
- [Route tags](15_Redistribution_and_AD/04_Route_Tags.md)
- [Filtering redistributed routes](15_Redistribution_and_AD/05_Filtering_Redistributed_Routes.md)
- [Mutual redistribution loops](15_Redistribution_and_AD/06_Mutual_Redistribution_Loops.md)
- [Default route injection](15_Redistribution_and_AD/07_Default_Route_Injection.md)

### [16. Authentication and security](16_Authentication_and_Security/README.md)

- [Why authenticate EIGRP](16_Authentication_and_Security/01_Why_Authenticate_EIGRP.md)
- [MD5 authentication and key chains](16_Authentication_and_Security/02_MD5_Authentication_and_Key_Chains.md)
- [HMAC-SHA in named mode](16_Authentication_and_Security/03_HMAC_SHA_Named_Mode.md)
- [Static neighbors hardening](16_Authentication_and_Security/04_Static_Neighbors_Hardening.md)
- [Passive interface as control](16_Authentication_and_Security/05_Passive_Interface_as_Control.md)
- [Operational auth failures](16_Authentication_and_Security/06_Operational_Auth_Failures.md)

### [17. WAN, NBMA, and tunnels](17_WAN_NBMA_and_Tunnels/README.md)

- [WAN design challenges](17_WAN_NBMA_and_Tunnels/01_WAN_Design_Challenges.md)
- [NBMA and multipoint](17_WAN_NBMA_and_Tunnels/02_NBMA_and_Multipoint.md)
- [Static neighbors on NBMA](17_WAN_NBMA_and_Tunnels/03_Static_Neighbors_on_NBMA.md)
- [Bandwidth percent and pacing](17_WAN_NBMA_and_Tunnels/04_Bandwidth_Percent_and_Pacing.md)
- [DMVPN and tunnel notes](17_WAN_NBMA_and_Tunnels/05_DMVPN_and_Tunnel_Notes.md)
- [Hub-spoke WAN checklist](17_WAN_NBMA_and_Tunnels/06_Hub_Spoke_WAN_Checklist.md)

### [18. Scale and design](18_Scale_and_Design/README.md)

- [Hierarchical addressing](18_Scale_and_Design/01_Hierarchical_Addressing.md)
- [Query domain architecture](18_Scale_and_Design/02_Query_Domain_Architecture.md)
- [Stub and summary together](18_Scale_and_Design/03_Stub_and_Summary_Together.md)
- [Wide metrics migration](18_Scale_and_Design/04_Wide_Metrics_Migration.md)
- [EIGRP as PE-CE](18_Scale_and_Design/05_EIGRP_as_PE_CE.md)
- [When to choose EIGRP](18_Scale_and_Design/06_When_to_Choose_EIGRP.md)

### [19. Operations and observability](19_Operations_and_Observability/README.md)

- [Essential show commands](19_Operations_and_Observability/01_Essential_Show_Commands.md)
- [EIGRP event log](19_Operations_and_Observability/02_EIGRP_Event_Log.md)
- [Debug strategy](19_Operations_and_Observability/03_Debug_Strategy.md)
- [Baseline health checks](19_Operations_and_Observability/04_Baseline_Health_Checks.md)
- [Logging and change control](19_Operations_and_Observability/05_Logging_and_Change_Control.md)

### [20. Troubleshooting](20_Troubleshooting/README.md)

- [Troubleshooting framework](20_Troubleshooting/01_Troubleshooting_Framework.md)
- [Neighbors not forming](20_Troubleshooting/02_Neighbors_Not_Forming.md)
- [Neighbor flaps](20_Troubleshooting/03_Neighbor_Flaps.md)
- [Route missing from topology](20_Troubleshooting/04_Route_Missing_from_Topology.md)
- [Route in topology not in RIB](20_Troubleshooting/05_Route_in_Topology_Not_in_RIB.md)
- [Active and SIA](20_Troubleshooting/06_Active_and_SIA.md)
- [Unexpected metrics](20_Troubleshooting/07_Unexpected_Metrics.md)
- [Variance not load sharing](20_Troubleshooting/08_Variance_Not_Load_Sharing.md)
- [Redistribution failures](20_Troubleshooting/09_Redistribution_Failures.md)
- [Data plane asymmetry](20_Troubleshooting/10_Data_Plane_Asymmetry.md)

### [21. Practical cases](21_Practical_Cases/README.md)

- [K-values mismatch silent](21_Practical_Cases/01_K_Values_Mismatch_Silent.md)
- [Spoke missing routes (split horizon)](21_Practical_Cases/02_Spoke_Missing_Routes_Split_Horizon.md)
- [SIA storm without stub](21_Practical_Cases/03_SIA_Storm_Without_Stub.md)
- [Summary blackhole without Null0](21_Practical_Cases/04_Summary_Blackhole_No_Null0.md)
- [Variance blocked by FC](21_Practical_Cases/05_Variance_Blocked_by_FC.md)
- [External AD 170 surprise](21_Practical_Cases/06_External_AD_170_Surprise.md)
- [Auth key rollover outage](21_Practical_Cases/07_Auth_Key_Rollover_Outage.md)
- [Bandwidth mis-set metric explosion](21_Practical_Cases/08_Bandwidth_Mis-set_Metric_Explosion.md)
- [Mutual redistribution loop](21_Practical_Cases/09_Mutual_Redistribution_Loop.md)
- [DMVPN spoke query problems](21_Practical_Cases/10_DMVPN_Spoke_Query_Problems.md)
- [IPv6 EIGRP no Router ID](21_Practical_Cases/11_IPv6_EIGRP_No_Router_ID.md)
- [Unequal delay tuning mistake](21_Practical_Cases/12_Unequal_Delay_Tuning_Mistake.md)

### [22. Interview questions](22_Interview_Questions/README.md)

- [Neighbors and transport](22_Interview_Questions/01_Neighbors_and_Transport.md)
- [DUAL, FD, RD, and FC](22_Interview_Questions/02_DUAL_FD_RD_FC.md)
- [Metrics, K-values, and wide metrics](22_Interview_Questions/03_Metrics_K_Values_Wide.md)
- [Stub, summary, and query scope](22_Interview_Questions/04_Stub_Summary_Query_Scope.md)
- [Variance and UCMP](22_Interview_Questions/05_Variance_and_UCMP.md)
- [Redistribution and AD](22_Interview_Questions/06_Redistribution_and_AD.md)
- [Named mode and IPv6](22_Interview_Questions/07_Named_Mode_and_IPv6.md)
- [Troubleshooting scenarios](22_Interview_Questions/08_Troubleshooting_Scenarios.md)

### [23. Labs](23_Labs/README.md)

- [Basic AS and neighbors](23_Labs/01_Basic_AS_and_Neighbors.md)
- [Successor and feasible successor](23_Labs/02_Successor_and_Feasible_Successor.md)
- [Force Active (no FS)](23_Labs/03_Force_Active_No_FS.md)
- [Stub query bounding](23_Labs/04_Stub_Query_Bounding.md)
- [Interface summarization and Null0](23_Labs/05_Interface_Summarization_Null0.md)
- [Variance UCMP](23_Labs/06_Variance_UCMP.md)
- [Named mode migration](23_Labs/07_Named_Mode_Migration.md)
- [Redistribution with tags](23_Labs/08_Redistribution_with_Tags.md)
- [Authentication key chain](23_Labs/09_Authentication_Key_Chain.md)
- [SIA and recovery](23_Labs/10_SIA_and_Recovery.md)

### [24. Memorization](24_Memorization/README.md)

- [EIGRP core facts](24_Memorization/01_EIGRP_Core_Facts.md)
- [DUAL memory card](24_Memorization/02_DUAL_Memory_Card.md)
- [Metric memory card](24_Memorization/03_Metric_Memory_Card.md)
- [Stub and summary memory card](24_Memorization/04_Stub_and_Summary_Memory_Card.md)
- [Troubleshooting chain](24_Memorization/05_Troubleshooting_Chain.md)

### [25. Common misconceptions](25_Common_Misconceptions/README.md)

- [Hybrid protocol myth](25_Common_Misconceptions/01_Hybrid_Protocol_Myth.md)
- [Variance ignores feasibility](25_Common_Misconceptions/02_Variance_Ignores_Feasibility.md)
- [Stub means no transit only](25_Common_Misconceptions/03_Stub_Means_No_Transit_Only.md)
- [Auto-summary is harmless](25_Common_Misconceptions/04_Auto_Summary_Is_Harmless.md)
- [EIGRP needs a full topology database](25_Common_Misconceptions/05_EIGRP_Needs_Full_Topology_Database.md)
- [Higher bandwidth always wins](25_Common_Misconceptions/06_Higher_Bandwidth_Always_Wins.md)
- [External routes same as internal](25_Common_Misconceptions/07_External_Routes_Same_as_Internal.md)

### [26. References](26_References/README.md)

- [RFC 7868 and specs](26_References/01_RFC_7868_and_Specs.md)
- [Cisco design and config references](26_References/02_Cisco_Design_and_Config_References.md)
- [DUAL and algorithm papers](26_References/03_DUAL_and_Algorithm_Papers.md)
- [Operational command references](26_References/04_Operational_Command_References.md)
- [Further reading](26_References/05_Further_Reading.md)

### [27. Follow-up](27_Follow_Up/README.md)

- Study next (OSPFv2/v3, IS-IS, BGP PE-CE, DMVPN design), open questions list, and personal lab backlog template — see the [module README](27_Follow_Up/README.md).

---
