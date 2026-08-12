# Interview: WAN, DC, and cloud

## Q1 — Is SD-WAN HA by itself?

**Model:** No. Need independent underlays + controller story.

## Q2 — Default DCI?

**Model:** L3. L2 stretch is a named fate-share.

## Q3 — Leaf-spine why?

**Model:** East-west ECMP and predictable oversubscription vs north-south three-tier.

## Q4 — Two ISPs on one fiber?

**Model:** Not multihoming. Shared fate.

## Q5 — Cloud on-ramp and GDPR?

**Model:** Pin region and destinations; encryption is not residency.

## Cross-links

[SD-WAN](../13_Campus_WAN_and_Edge/03_SD_WAN_Design.md), [DCI](../14_Data_Center_and_Cloud/03_DCI_Patterns.md).

---
