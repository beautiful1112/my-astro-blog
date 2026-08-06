# Interview questions: membership and Layer 2

**What does IGMPv3 add?** INCLUDE/EXCLUDE source filtering and native SSM signaling.

**How is the IGMP querier elected?** Lowest IPv4 address for IGMPv2/v3.

**Why does traffic work then stop?** Initial reports create snooping state, but without Queries it expires.

**Is snooping a routing protocol?** No; it is a Layer-2 replication optimization.

**When is fast leave unsafe?** Whenever multiple listeners may be behind one port.

