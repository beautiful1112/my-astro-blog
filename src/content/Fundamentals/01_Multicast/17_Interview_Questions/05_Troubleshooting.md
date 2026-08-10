# Interview questions: troubleshooting

## Question

You see an IGMP Report but no data—what next? An mroute exists but counters are flat—why? Existing receivers work but a new receiver fails—where do you look? One host drops on a working VLAN—network or host? What is a null OIL? What is the preferred design for a controlled one-source feed?

## Strong answer

- **Report, no data:** Verify snooping/LHR OIF, then PIM Join/RPF toward S or RP, then trace data counters from the source. A Report is only local interest.
- **Mroute, no packets:** No source traffic, RPF failure, null OIL, TTL/policy drop, or missing hardware/MFIB programming.
- **New receiver fails:** Membership on that port/VLAN, Join propagation, RP reachability/mapping (ASM), and source discovery/sync—not the whole domain “being down.”
- **One host:** Start at the host boundary: join interface, firewall, NIC rings, socket buffers, scheduling, decoder—VLAN peers prove the tree.
- **Null OIL:** State exists but no downstream interface currently needs forwarding (no interest or pruned).
- **Controlled one-source design:** Usually SSM/IGMPv3, direct source trees, allowlists/boundaries, independent A/B paths, and application recovery.

## Follow-ups

- Show commands for RPF vs unicast ping disagreement?
- How do you distinguish microburst loss from steady under-capacity?
- What capture filter proves SSM INCLUDE?

## Cross-links

[Define the flow](../15_Troubleshooting/01_Define_the_Flow.md), [Control from receiver](../15_Troubleshooting/02_Control_State_From_Receiver.md), [Data from source](../15_Troubleshooting/03_Data_From_Source.md), [Symptom matrix](../15_Troubleshooting/04_Symptom_Matrix.md), [Design pattern](../12_Quant_Trading_Market_Data/08_Low_Latency_Design_Pattern.md).

---
