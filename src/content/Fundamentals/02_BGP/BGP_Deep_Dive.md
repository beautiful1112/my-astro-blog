# BGP - Modular Deep-Dive Study Library

> **Audience:** Network-engineering and quantitative-trading infrastructure interviews  
> **Goal:** Master BGP wire behavior, policy, path selection, scaling, security, service families, failure modes, and low-latency applications—not merely configuration syntax.  
> **Revision:** 1.0 - 2026-07-24  
> **Structure:** 204 focused knowledge-point documents in 30 numbered modules.

Each topic is a separate document so it can be studied, discussed, tested, and revised independently.

## Recommended sequence

1. Modules 01-07: mental model, sessions, messages, RIB stages, and update processing.
2. Modules 08-14: attributes, best path, policy, iBGP scaling, and MP-BGP.
3. Modules 15-20: convergence, security, RPKI, VPN/EVPN, and advanced families.
4. Modules 21-23: operations, quantitative-trading design, and deterministic troubleshooting.
5. Modules 24-30: cases, interview drills, labs, memorization, misconceptions, and references.

## Modules

### [01. Study roadmap](01_Study_Roadmap/README.md)

- [How to study BGP](01_Study_Roadmap/01_How_to_Study_BGP.md)
- [BGP learning objectives](01_Study_Roadmap/02_Learning_Objectives.md)

### [02. Fundamentals](02_Fundamentals/README.md)

- [What BGP is](02_Fundamentals/01_What_BGP_Is.md)
- [Why BGP exists](02_Fundamentals/02_Why_BGP_Exists.md)
- [Path vector and policy](02_Fundamentals/03_Path_Vector_and_Policy.md)
- [BGP control plane versus data plane](02_Fundamentals/04_Control_Plane_vs_Data_Plane.md)
- [Core BGP terminology](02_Fundamentals/05_Core_Terminology.md)

### [03. ASNs and peering](03_ASNs_and_Peering/README.md)

- [Autonomous System numbers](03_ASNs_and_Peering/01_AS_Number_Space.md)
- [eBGP versus iBGP](03_ASNs_and_Peering/02_eBGP_vs_iBGP.md)
- [Peering relationships](03_ASNs_and_Peering/03_Peering_Types_and_Relationships.md)
- [Private ASNs and remove-private-AS](03_ASNs_and_Peering/04_Private_ASNs_and_Remove_Private_AS.md)

### [04. Sessions and transport](04_Sessions_and_Transport/README.md)

- [BGP transport over TCP 179](04_Sessions_and_Transport/01_TCP_179.md)
- [Direct and multihop eBGP](04_Sessions_and_Transport/02_Direct_and_Multihop_eBGP.md)
- [Update source and loopback peering](04_Sessions_and_Transport/03_Update_Source_and_Loopbacks.md)
- [Connection collision and passive mode](04_Sessions_and_Transport/04_Connection_Collision_and_Passive_Mode.md)
- [BGP session protection](04_Sessions_and_Transport/05_Session_Authentication_and_GTSM.md)

### [05. Finite state machine and timers](05_FSM_and_Timers/README.md)

- [BGP finite-state machine](05_FSM_and_Timers/01_Finite_State_Machine.md)
- [OPEN negotiation](05_FSM_and_Timers/02_OPEN_Negotiation.md)
- [Hold and Keepalive timers](05_FSM_and_Timers/03_Hold_and_Keepalive_Timers.md)
- [ConnectRetry and session retry behavior](05_FSM_and_Timers/04_ConnectRetry_and_Dampening.md)
- [NOTIFICATION and reset reasons](05_FSM_and_Timers/05_NOTIFICATIONS_and_Reset_Reasons.md)

### [06. Messages and capabilities](06_Messages_and_Capabilities/README.md)

- [BGP common message header](06_Messages_and_Capabilities/01_Common_Message_Header.md)
- [OPEN message](06_Messages_and_Capabilities/02_OPEN_Message.md)
- [UPDATE message](06_Messages_and_Capabilities/03_UPDATE_Message.md)
- [KEEPALIVE and NOTIFICATION messages](06_Messages_and_Capabilities/04_KEEPALIVE_and_NOTIFICATION.md)
- [Route Refresh](06_Messages_and_Capabilities/05_Route_Refresh.md)
- [BGP capabilities](06_Messages_and_Capabilities/06_Capability_Negotiation.md)
- [UPDATE error handling and treat-as-withdraw](06_Messages_and_Capabilities/07_Error_Handling_Treat_as_Withdraw.md)

### [07. RIBs and UPDATE processing](07_RIBs_and_Updates/README.md)

- [Adj-RIB-In, Loc-RIB, and Adj-RIB-Out](07_RIBs_and_Updates/01_Three_Conceptual_RIBs.md)
- [NLRI and longest-prefix match](07_RIBs_and_Updates/02_NLRI_and_Longest_Prefix_Match.md)
- [Advertisement, withdrawal, and replacement](07_RIBs_and_Updates/03_Advertisements_Withdrawals_and_Replacement.md)
- [Next-hop resolution](07_RIBs_and_Updates/04_Next_Hop_Resolution.md)
- [Soft reconfiguration versus Route Refresh](07_RIBs_and_Updates/05_Soft_Reconfiguration_vs_Refresh.md)

### [08. Path attributes](08_Path_Attributes/README.md)

- [Path-Attribute Categories and Flags](08_Path_Attributes/01_Attribute_Categories_and_Flags.md)
- [ORIGIN](08_Path_Attributes/02_ORIGIN.md)
- [AS_PATH and Loop Prevention](08_Path_Attributes/03_AS_PATH_and_Loop_Prevention.md)
- [AS-Path Prepending](08_Path_Attributes/04_AS_Path_Prepending.md)
- [Four-Octet ASN Path Handling](08_Path_Attributes/05_Four_Octet_AS_Path_Handling.md)
- [NEXT_HOP](08_Path_Attributes/06_NEXT_HOP.md)
- [LOCAL_PREF](08_Path_Attributes/07_LOCAL_PREF.md)
- [Multi-Exit Discriminator](08_Path_Attributes/08_MED.md)
- [ATOMIC_AGGREGATE and AGGREGATOR](08_Path_Attributes/09_ATOMIC_AGGREGATE_and_AGGREGATOR.md)
- [Unknown Attributes and the Partial Bit](08_Path_Attributes/10_Unknown_Attributes_and_Partial_Bit.md)

### [09. Communities](09_Communities/README.md)

- [Standard Communities](09_Communities/01_Standard_Communities.md)
- [Well-Known Communities](09_Communities/02_Well_Known_Communities.md)
- [Extended Communities](09_Communities/03_Extended_Communities.md)
- [Large Communities](09_Communities/04_Large_Communities.md)
- [Community-Based Policy Design](09_Communities/05_Community_Based_Policy_Design.md)
- [Route Distinguisher vs Route Target](09_Communities/06_RD_vs_RT.md)

### [10. Best-path selection](10_Best_Path/README.md)

- [Eligibility Before Best-Path Selection](10_Best_Path/01_Eligibility_Before_Selection.md)
- [Vendor-Neutral Best-Path Model](10_Best_Path/02_Vendor_Neutral_Selection_Model.md)
- [Administrative Preference and LOCAL_PREF](10_Best_Path/03_Administrative_Preference_and_LOCAL_PREF.md)
- [AS_PATH, ORIGIN, and MED Comparisons](10_Best_Path/04_AS_PATH_ORIGIN_and_MED_Comparisons.md)
- [eBGP vs iBGP and IGP Cost to Next Hop](10_Best_Path/05_eBGP_iBGP_and_IGP_Cost.md)
- [Final BGP Tie-Breakers](10_Best_Path/06_Final_Tie_Breakers.md)
- [BGP Multipath and ECMP](10_Best_Path/07_Multipath_and_ECMP.md)

### [11. Policy and traffic engineering](11_Policy_and_Traffic_Engineering/README.md)

- [Import vs Export Policy](11_Policy_and_Traffic_Engineering/01_Import_vs_Export_Policy.md)
- [Prefix Filtering](11_Policy_and_Traffic_Engineering/02_Prefix_Filtering.md)
- [AS-Path Filtering](11_Policy_and_Traffic_Engineering/03_AS_Path_Filtering.md)
- [Default-Reject eBGP Policy](11_Policy_and_Traffic_Engineering/04_Default_Reject_RFC8212.md)
- [Customer, Peer, and Provider Export Rules](11_Policy_and_Traffic_Engineering/05_Valley_Free_Export.md)
- [Outbound vs Inbound Traffic Engineering](11_Policy_and_Traffic_Engineering/06_Outbound_and_Inbound_Traffic_Engineering.md)
- [Aggregation and Discard Routes](11_Policy_and_Traffic_Engineering/07_Aggregation_and_Discard_Routes.md)
- [Maximum-Prefix and Route-Flap Dampening](11_Policy_and_Traffic_Engineering/08_Maximum_Prefix_and_Dampening.md)

### [12. eBGP and iBGP](12_eBGP_and_iBGP/README.md)

- [eBGP Advertisement and AS Loops](12_eBGP_and_iBGP/01_eBGP_Advertisement_and_AS_Loops.md)
- [iBGP Split Horizon and Full Mesh](12_eBGP_and_iBGP/02_iBGP_Split_Horizon_and_Full_Mesh.md)
- [next-hop-self](12_eBGP_and_iBGP/03_Next_Hop_Self.md)
- [IGP and BGP Interaction](12_eBGP_and_iBGP/04_IGP_and_BGP_Interaction.md)
- [Route Origination, Defaults, and Redistribution](12_eBGP_and_iBGP/05_Origination_Defaults_and_Redistribution.md)

### [13. Route reflection and confederations](13_Route_Reflection_and_Confederations/README.md)

- [Route-Reflector Roles](13_Route_Reflection_and_Confederations/01_Route_Reflector_Roles.md)
- [ORIGINATOR_ID and CLUSTER_LIST](13_Route_Reflection_and_Confederations/02_ORIGINATOR_ID_and_CLUSTER_LIST.md)
- [Route-Reflector Path Hiding](13_Route_Reflection_and_Confederations/03_Path_Hiding.md)
- [Route-Reflector Placement and IGP Congruence](13_Route_Reflection_and_Confederations/04_Reflector_Placement_and_IGP_Congruence.md)
- [BGP ADD-PATH](13_Route_Reflection_and_Confederations/05_ADD_PATH.md)
- [BGP Confederations](13_Route_Reflection_and_Confederations/06_Confederations.md)

### [14. Multiprotocol BGP](14_MP_BGP/README.md)

- [AFI, SAFI, and Multiprotocol BGP](14_MP_BGP/01_AFI_SAFI_and_MP_Attributes.md)
- [IPv6 Unicast over MP-BGP](14_MP_BGP/02_IPv6_Unicast.md)
- [IPv4 NLRI with an IPv6 Next Hop](14_MP_BGP/03_IPv4_NLRI_with_IPv6_Next_Hop.md)
- [BGP Labeled Unicast](14_MP_BGP/04_Labeled_Unicast.md)
- [VPNv4 and VPNv6 Address Families](14_MP_BGP/05_VPNv4_and_VPNv6.md)
- [Multicast SAFIs and the Relationship to PIM](14_MP_BGP/06_Multicast_SAFIs_and_PIM_Relationship.md)
- [Per-Family Activation and Policy](14_MP_BGP/07_Per_Family_Activation_and_Policy.md)

### [15. Convergence and resilience](15_Convergence_and_Resilience/README.md)

- [BGP Convergence Model](15_Convergence_and_Resilience/01_BGP_Convergence_Model.md)
- [Failure Detection and BFD](15_Convergence_and_Resilience/02_Failure_Detection_and_BFD.md)
- [Update Pacing and MRAI](15_Convergence_and_Resilience/03_Update_Pacing_and_MRAI.md)
- [BGP Graceful Restart](15_Convergence_and_Resilience/04_Graceful_Restart.md)
- [Long-Lived Graceful Restart](15_Convergence_and_Resilience/05_Long_Lived_Graceful_Restart.md)
- [Graceful BGP Shutdown](15_Convergence_and_Resilience/06_Graceful_Shutdown.md)
- [Prefix Independent Convergence](15_Convergence_and_Resilience/07_Prefix_Independent_Convergence.md)
- [Path Diversity and Fast Reroute](15_Convergence_and_Resilience/08_Path_Diversity_and_Fast_Reroute.md)

### [16. Security and hardening](16_Security_and_Hardening/README.md)

- [BGP Threat Model](16_Security_and_Hardening/01_BGP_Threat_Model.md)
- [TCP MD5 and TCP-AO](16_Security_and_Hardening/02_TCP_MD5_and_TCP_AO.md)
- [GTSM and TTL Protection](16_Security_and_Hardening/03_GTSM_and_TTL_Protection.md)
- [Infrastructure ACLs and Control-Plane Policing](16_Security_and_Hardening/04_Infrastructure_ACLs_and_Control_Plane_Policing.md)
- [Prefix, AS-Path, and First-AS Validation](16_Security_and_Hardening/05_Prefix_AS_Path_and_First_AS_Validation.md)
- [Maximum-Prefix and Resource Protection](16_Security_and_Hardening/06_Maximum_Prefix_and_Resource_Protection.md)
- [Remotely Triggered Black Hole](16_Security_and_Hardening/07_Remotely_Triggered_Black_Hole.md)

### [17. RPKI and route-leak prevention](17_RPKI_and_Leak_Prevention/README.md)

- [RPKI, ROAs, and VRPs](17_RPKI_and_Leak_Prevention/01_RPKI_ROAs_and_VRPs.md)
- [RPKI Origin-Validation States](17_RPKI_and_Leak_Prevention/02_Valid_Invalid_and_NotFound.md)
- [RPKI-to-Router Protocol and Validator Design](17_RPKI_and_Leak_Prevention/03_RTR_Protocol_and_Validator_Design.md)
- [Origin-Validation Policy](17_RPKI_and_Leak_Prevention/04_Origin_Validation_Policy.md)
- [ROA maxLength Risks](17_RPKI_and_Leak_Prevention/05_ROA_MaxLength_Risks.md)
- [BGPsec Scope and Limits](17_RPKI_and_Leak_Prevention/06_BGPsec_Scope_and_Limits.md)
- [BGP Route Leaks](17_RPKI_and_Leak_Prevention/07_Route_Leaks.md)
- [BGP Roles and Only-to-Customer](17_RPKI_and_Leak_Prevention/08_BGP_Roles_and_OTC.md)

### [18. MPLS Layer 3 VPN](18_MPLS_L3VPN/README.md)

- [MPLS L3VPN Control Plane](18_MPLS_L3VPN/01_L3VPN_Control_Plane.md)
- [Route Distinguishers in L3VPN](18_MPLS_L3VPN/02_Route_Distinguishers.md)
- [Route-Target Import and Export](18_MPLS_L3VPN/03_Route_Target_Import_and_Export.md)
- [VPN Labels and Forwarding](18_MPLS_L3VPN/04_VPN_Labels_and_Forwarding.md)
- [Inter-VRF Route Leaking](18_MPLS_L3VPN/05_Inter_VRF_Leaking.md)
- [Route-Target Constraint](18_MPLS_L3VPN/06_Route_Target_Constraint.md)

### [19. Ethernet VPN](19_EVPN/README.md)

- [What EVPN Provides](19_EVPN/01_What_EVPN_Provides.md)
- [EVPN Route Types](19_EVPN/02_EVPN_Route_Types.md)
- [Ethernet Segment Identifier and Multihoming](19_EVPN/03_ESI_and_Multihoming.md)
- [Designated Forwarder and Split Horizon](19_EVPN/04_Designated_Forwarder_and_Split_Horizon.md)
- [EVPN MAC Mobility](19_EVPN/05_MAC_Mobility.md)
- [ARP and ND Suppression](19_EVPN/06_ARP_ND_Suppression.md)
- [EVPN over VXLAN vs MPLS](19_EVPN/07_VXLAN_vs_MPLS_Data_Planes.md)

### [20. Advanced families and extensions](20_Advanced_Families/README.md)

- [BGP FlowSpec](20_Advanced_Families/01_BGP_FlowSpec.md)
- [BGP Link-State](20_Advanced_Families/02_BGP_Link_State.md)
- [BGP Advertisement of Segment-Routing Policies](20_Advanced_Families/03_BGP_SR_Policy.md)
- [BGP Prefix-SID Advertisement](20_Advanced_Families/04_Prefix_SID_Advertisement.md)
- [BGP Monitoring Protocol](20_Advanced_Families/05_BMP.md)
- [Anycast with BGP](20_Advanced_Families/06_Anycast_with_BGP.md)
- [Internet Exchange Route Servers](20_Advanced_Families/07_Route_Server_Behavior.md)
- [BGP Color-Aware Routing](20_Advanced_Families/08_BGP_Color_Aware_Routing.md)
- [BGP-LS SPF Routing](20_Advanced_Families/09_BGP_LS_SPF_Routing.md)

### [21. Operations and observability](21_Operations_and_Observability/README.md)

- [Operational Inspection Order](21_Operations_and_Observability/01_Operational_Inspection_Order.md)
- [Cisco-Style BGP Inspection Examples](21_Operations_and_Observability/02_Cisco_Inspection_Examples.md)
- [Junos BGP Inspection Examples](21_Operations_and_Observability/03_Junos_Inspection_Examples.md)
- [FRRouting Inspection Examples](21_Operations_and_Observability/04_FRR_Inspection_Examples.md)
- [Five Route Views](21_Operations_and_Observability/05_Received_Accepted_Best_Installed_Advertised.md)
- [Packet Capture and BGP Message Decoding](21_Operations_and_Observability/06_Packet_Capture_and_Message_Decoding.md)
- [BMP, Route Collectors, and Telemetry](21_Operations_and_Observability/07_BMP_Route_Collectors_and_Telemetry.md)
- [Route Churn and BGP Health Metrics](21_Operations_and_Observability/08_Route_Churn_and_Health_Metrics.md)
- [Safe BGP Change Workflow](21_Operations_and_Observability/09_Safe_BGP_Change_Workflow.md)

### [22. Quantitative-trading networks](22_Quant_Trading_Networks/README.md)

- [BGP's Role in Quantitative-Trading Infrastructure](22_Quant_Trading_Networks/01_BGP_Role_in_Trading_Infrastructure.md)
- [External Connectivity Design](22_Quant_Trading_Networks/02_External_Connectivity_Design.md)
- [Latency-Aware Path Control](22_Quant_Trading_Networks/03_Latency_Aware_Path_Control.md)
- [Asymmetric Routing in Trading Networks](22_Quant_Trading_Networks/04_Asymmetric_Routing.md)
- [Fast Failover vs Stability](22_Quant_Trading_Networks/05_Fast_Failover_vs_Stability.md)
- [Market-Data vs Order-Path Policy](22_Quant_Trading_Networks/06_Market_Data_vs_Order_Path_Policy.md)
- [DDoS Response for Trading Services](22_Quant_Trading_Networks/07_DDoS_RTBH_and_FlowSpec.md)
- [Anycast for Trading-Support Services](22_Quant_Trading_Networks/08_Anycast_Service_Design.md)
- [Capacity and Failure Domains](22_Quant_Trading_Networks/09_Capacity_and_Failure_Domains.md)
- [Change Control and Evidence for Critical BGP Paths](22_Quant_Trading_Networks/10_Change_Control_and_Evidence.md)

### [23. Deterministic troubleshooting](23_Troubleshooting/README.md)

- [BGP Troubleshooting Framework](23_Troubleshooting/01_Troubleshooting_Framework.md)
- [Session Stuck in Idle or Active](23_Troubleshooting/02_Session_Stuck_in_Idle_or_Active.md)
- [Established but No Routes](23_Troubleshooting/03_Established_but_No_Routes.md)
- [Route Received but Rejected](23_Troubleshooting/04_Route_Received_but_Rejected.md)
- [Route Accepted but Not Best](23_Troubleshooting/05_Route_Accepted_but_Not_Best.md)
- [Best BGP Path Not Installed in the RIB](23_Troubleshooting/06_Best_BGP_Path_Not_in_RIB.md)
- [Route Not Advertised to a Peer](23_Troubleshooting/07_Route_Not_Advertised.md)
- [Unresolved BGP Next Hop](23_Troubleshooting/08_Unresolved_Next_Hop.md)
- [Route Flaps and Session Resets](23_Troubleshooting/09_Route_Flaps_and_Session_Resets.md)
- [Asymmetry and Data-Plane Failure](23_Troubleshooting/10_Asymmetry_and_Data_Plane_Failure.md)

### [24. Practical cases](24_Practical_Cases/README.md)

- [Case: Established Session, Zero Prefixes](24_Practical_Cases/01_Established_Session_Zero_Prefixes.md)
- [Case: Received Route with an Unresolved Next Hop](24_Practical_Cases/02_Received_Route_Unresolved_Next_Hop.md)
- [Case: Route Reflector Hides the Low-Latency Path](24_Practical_Cases/03_Route_Reflector_Hides_Low_Latency_Path.md)
- [Case: LOCAL_PREF Beats a Shorter AS Path](24_Practical_Cases/04_LOCAL_PREF_Beats_Shorter_AS_Path.md)
- [Case: MED Does Not Influence Two Upstreams](24_Practical_Cases/05_MED_Not_Compared_Across_Upstreams.md)
- [Case: More-Specific Hijack Beats Better Attributes](24_Practical_Cases/06_More_Specific_Hijack_Beats_Attributes.md)
- [Case: Route Leak Creates Unintended Transit](24_Practical_Cases/07_Route_Leak_Creates_Unintended_Transit.md)
- [Case: Graceful Restart Preserves a Blackhole](24_Practical_Cases/08_Graceful_Restart_Stale_Blackhole.md)
- [Case: ROA maxLength Invalidates a TE Prefix](24_Practical_Cases/09_ROA_MaxLength_Makes_TE_Prefix_Invalid.md)
- [Case: IXP Route-Server Session Up, Data Plane Down](24_Practical_Cases/10_Route_Server_Up_Data_Plane_Down.md)
- [Case: Best BGP Route Loses to a Static Route](24_Practical_Cases/11_Best_BGP_Route_Loses_to_Static.md)
- [Case: Aggressive BFD Causes Path Oscillation](24_Practical_Cases/12_Fast_BFD_Causes_Path_Oscillation.md)

### [25. Interview questions](25_Interview_Questions/README.md)

- [Interview: Why Does BGP Use TCP?](25_Interview_Questions/01_Why_Does_BGP_Use_TCP.md)
- [Interview: Explain the Three BGP RIBs](25_Interview_Questions/02_Explain_BGP_RIBs.md)
- [Interview: LOCAL_PREF vs MED](25_Interview_Questions/03_LOCAL_PREF_vs_MED.md)
- [Interview: Why Does iBGP Need a Full Mesh?](25_Interview_Questions/04_iBGP_Full_Mesh_and_RR.md)
- [Interview: Why Is a BGP Route Not in the RIB?](25_Interview_Questions/05_Why_Route_in_BGP_Not_RIB.md)
- [Interview: How Does BGP Prevent Loops?](25_Interview_Questions/06_AS_PATH_and_Loop_Prevention.md)
- [Interview: Why Does RPKI Not Stop Every Route Leak?](25_Interview_Questions/07_RPKI_Does_Not_Stop_Leaks.md)
- [Interview: Why Might AS Prepending Fail?](25_Interview_Questions/08_AS_Prepending_Limitations.md)
- [Interview: What Is the Risk of Graceful Restart?](25_Interview_Questions/09_Graceful_Restart_Risk.md)
- [Interview: Explain Route-Reflector Path Hiding](25_Interview_Questions/10_Route_Reflector_Path_Hiding.md)
- [Interview: Debug Established but No Routes](25_Interview_Questions/11_Debug_Established_No_Routes.md)
- [Interview: Design BGP for a Low-Latency Trading Site](25_Interview_Questions/12_Low_Latency_BGP_Design.md)

### [26. Labs and mastery exercises](26_Labs/README.md)

- [Lab: Basic eBGP Origination](26_Labs/01_Basic_eBGP_Origination.md)
- [Lab: Best-Path Attribute Ladder](26_Labs/02_Best_Path_Attribute_Ladder.md)
- [Lab: iBGP and next-hop-self](26_Labs/03_iBGP_Next_Hop_Self.md)
- [Lab: Route Reflection and Path Hiding](26_Labs/04_Route_Reflection_and_Path_Hiding.md)
- [Lab: Import/Export Policy and Route Leak](26_Labs/05_Import_Export_and_Route_Leak.md)
- [Lab: RPKI Origin Validation](26_Labs/06_RPKI_Origin_Validation.md)
- [Lab: Graceful Restart vs Hard Failure](26_Labs/07_Graceful_Restart_vs_Hard_Failure.md)
- [Lab: MP-BGP VPN Route Targets](26_Labs/08_MP_BGP_VPN_Route_Targets.md)
- [Lab: EVPN MAC Mobility](26_Labs/09_EVPN_MAC_Mobility.md)
- [Lab: Measure BGP Failover Loss](26_Labs/10_Failover_Loss_Measurement.md)

### [27. Memorization sheets](27_Memorization/README.md)

- [BGP Core Facts to Memorize](27_Memorization/01_BGP_Core_Facts.md)
- [Path-Attribute Memory Table](27_Memorization/02_Attribute_Memory_Table.md)
- [BGP Troubleshooting Chain to Memorize](27_Memorization/03_Troubleshooting_Chain.md)
- [RPKI and Route-Leak Memory Card](27_Memorization/04_RPKI_and_Leak_Memory_Card.md)

### [28. Common misconceptions](28_Common_Misconceptions/README.md)

- [Misconception: Established Means Routing Works](28_Common_Misconceptions/01_Session_Up_Means_Routing_Works.md)
- [Misconception: Shortest AS Path Is Fastest](28_Common_Misconceptions/02_Shortest_AS_Path_Is_Fastest.md)
- [Misconception: RPKI Valid Means Safe](28_Common_Misconceptions/03_RPKI_Valid_Means_Safe.md)
- [Misconception: More BGP Peers Always Mean More Resilience](28_Common_Misconceptions/04_More_Peers_Always_Mean_More_Resilience.md)

### [29. Primary references](29_References/README.md)

- [Core BGP RFCs](29_References/01_Core_BGP_RFCs.md)
- [Attributes, Scaling, and Resilience RFCs](29_References/02_Attributes_Scaling_and_Resilience_RFCs.md)
- [Security and Operations RFCs](29_References/03_Security_and_Operations_RFCs.md)
- [VPN, EVPN, and Advanced-Family RFCs](29_References/04_VPN_EVPN_and_Advanced_RFCs.md)
- [Current and Implementation References](29_References/05_Current_and_Implementation_References.md)

### [30. Follow-up discussions](30_Follow_Up/README.md)

- [Study, Discussion, and Update Workflow](30_Follow_Up/01_Study_Discussion_and_Update_Workflow.md)

## Maintenance convention

- Update the smallest document that owns the knowledge point.
- Add cross-links when one mechanism changes another stage of route processing.
- Keep standards and command details tied to Module 29 primary references.
- Increment the revision after major structural or standards changes.
