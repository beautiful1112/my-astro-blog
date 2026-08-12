# IS-IS versus OSPF for design

Both are link-state IGPs. CCDE cares about **operational and architectural** differences, not TLV trivia for its own sake.

| | OSPF | IS-IS |
|---|---|---|
| Layer | IP (OSPFv2/v3) | CLNS-framed; carries IP in TLVs |
| Hierarchy | Areas + backbone area 0 | L1/L2; backbone is L2 contiguous |
| Dual stack | OSPFv3 AF or ships-in-night | Natural multi-topology / TLVs |
| Culture | Enterprise | SP and large DC/core |
| Extensions | Many | SR, TE historically comfortable |

Pick IS-IS when the constraint is a **large, dual-stack, MPLS/SR core** and staff can operate it. Pick OSPF when the constraint is enterprise skill and campus hierarchy. Neither is universally “faster.”

## Interview framing

“I use IS-IS for large dual-stack MPLS/SR cores and OSPF when the enterprise already lives in areas. I do not migrate for fashion.”

---
