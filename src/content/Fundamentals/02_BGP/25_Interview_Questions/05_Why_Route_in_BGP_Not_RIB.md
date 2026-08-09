# Interview: Why Is a BGP Route Not in the RIB?

## Question

A prefix is best in BGP but missing (or not used) in the routing table. Why?

## Strong answer

BGP best-path and RIB installation are separate. Common causes:

1. Unresolved NEXT_HOP (no recursive route).
2. Better administrative distance from static/IGP.
3. Table-map / install policy filtering BGP from RIB.
4. VRF/label programming failure (VPN/EVPN).
5. Platform marks path best only when resolvable—or shows best but CEF incomplete.

Show commands must compare Loc-RIB, `show ip route`, and CEF/FT. “BGP has it” is not “forwarding uses it.”

## Follow-ups

- How do you prove NH recursion?
- Floating static vs BGP AD examples?
- Interaction with next-hop-self?

## Cross-links

[Best not in RIB](../23_Troubleshooting/06_Best_BGP_Path_Not_in_RIB.md), [Static wins case](../24_Practical_Cases/11_Best_BGP_Route_Loses_to_Static.md).

---
