# Interview questions: troubleshooting

**IGMP Report seen, but no data—what next?** Verify snooping/LHR OIF, PIM Join/RPF, then trace data counters from the source.

**Mroute exists but no packets—why?** No source traffic, wrong RPF, null OIL, TTL/policy, or missing hardware programming.

**Existing receivers work; new receivers fail—where look?** Membership, Join propagation, RP reachability/mapping, and source synchronization.

**One host drops on a working VLAN—network or host?** Start at the host boundary and inspect NIC ring, driver, socket, scheduling, and decoder.

**What is a null OIL?** State exists but no downstream interface currently requires forwarding.

**Preferred controlled one-source design?** Usually SSM/IGMPv3, direct source trees, allowlists, independent redundant paths, and application recovery.

