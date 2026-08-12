# Scale limits and modularity

Scale axes: prefixes, MACs, sites, tunnels, policies, ops humans, east-west bandwidth. A design that scales packets but not **operators** still fails.

Modularity: you can add a building/region without redesigning the core, because summaries, RTs, and controllers were built as **modules**.

When a vendor limit (VRFs per PE, ISE PPS, RR CPU) is near, **split the domain** before you hit the wall in production.

## Interview framing

“I scale by splitting modules at summary and policy boundaries, and I count operator cognitive load as a limit next to TCAM.”

---
