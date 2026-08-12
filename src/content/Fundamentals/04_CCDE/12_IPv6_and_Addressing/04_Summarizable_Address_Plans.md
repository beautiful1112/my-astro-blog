# Summarizable address plans

Allocate **contiguous blocks per module** (site, building, VRF, region) so ABRs/RRs/firewalls can hide internals.

```text
10.0.0.0/12 company
  10.0.0.0/16 region-west
    10.0.10.0/20 campus-A
    10.0.20.0/20 campus-B
  10.1.0.0/16 region-east
```

Same idea for IPv6 with generous nibble boundaries (easier ops than “clever” packing).

M&A overlap: do not summarily NAT the world—use a **seam** (VRF, NAT only at the border, or renumber the smaller side) with a calendar.

## Interview framing

“I allocate by hierarchy first so summaries are honest. Overlap is a migration project, not a permanent NAT lifestyle.”

---
