# Interview: Explain Route-Reflector Path Hiding

## Question

What is route-reflector path hiding, and how do you mitigate it?

## Strong answer

An RR runs best-path and (without ADD-PATH) advertises only the winning path for each prefix to clients. Alternate paths—possibly lower latency or more diverse—never reach clients. That is **path hiding**.

Mitigations: ADD-PATH / diverse-path, careful LP so the RR’s best matches intent, hierarchical designs, or selective client peering to multiple edges for VIP prefixes. Shadow RRs with different IGP placement still hide if they compute the same single best.

## Follow-ups

- ADD-PATH encoding and memory cost?
- How does hiding interact with multipath / link-bandwidth?
- Optimal RR placement myths?

## Cross-links

[RR hide case](../24_Practical_Cases/03_Route_Reflector_Hides_Low_Latency_Path.md), [RR lab](../26_Labs/04_Route_Reflection_and_Path_Hiding.md).

---
