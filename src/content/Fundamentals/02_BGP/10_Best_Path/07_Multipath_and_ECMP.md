# BGP Multipath and ECMP

Multipath allows multiple sufficiently equivalent BGP paths to enter the forwarding table. The router still commonly identifies one path as the BGP best for advertisement and metadata.

Eligibility knobs can require or relax equality for:

- AS_PATH.
- Neighboring ASN.
- MED.
- eBGP versus iBGP.
- IGP metric to next hop.

Data-plane hashing is separate. Per-flow ECMP avoids packet reordering, but unequal flows can cause polarization or link imbalance. Resilient hashing reduces movement when a member changes.

In latency-sensitive environments, two equal control-plane paths may have unequal delay or loss. Enable ECMP only when physical paths and failure characteristics are understood, and test what happens to existing flows when a next hop disappears.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
