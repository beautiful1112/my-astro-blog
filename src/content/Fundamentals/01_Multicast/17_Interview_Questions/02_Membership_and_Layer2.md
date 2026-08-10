# Interview questions: membership and Layer 2

## Question

What does IGMPv3 add? How is the IGMP querier elected? Why can multicast work then stop on a snooped VLAN? Is snooping a routing protocol? When is fast leave unsafe?

## Strong answer

- **IGMPv3:** INCLUDE/EXCLUDE source filtering and native SSM signaling; receivers can ask for specific sources.
- **Querier:** For IGMPv2/v3, the device with the lowest IPv4 address on the link wins querier election and sends periodic General Queries.
- **Works then stops:** Initial Reports create snooping state; without Queries (no querier/router), entries expire and traffic stops even though the sender is fine.
- **Snooping:** Layer-2 optimization that constrains flood to member and mrouter ports—not a replacement for PIM.
- **Fast leave:** Unsafe when multiple listeners may sit behind one port (hub, unmanaged switch, or untracked hosts); leaving one can prune the last member incorrectly.

## Follow-ups

- What is an mrouter port and why must it exist?
- IGMPv2 vs v3 interop on one VLAN?
- How do you prove the querier is alive in production?

## Cross-links

[Membership lifecycle lab](../18_Labs/02_Membership_Lifecycle.md), [No querier lab](../18_Labs/03_No_Querier.md), [Same VLAN no router](../16_Practical_Cases/01_Same_VLAN_No_Router.md), [Fast leave](../16_Practical_Cases/05_Fast_Leave_Blackhole.md).

---
