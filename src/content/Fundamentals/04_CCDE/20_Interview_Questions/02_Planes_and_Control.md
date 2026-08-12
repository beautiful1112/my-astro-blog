# Interview: planes and control

## Q1 — Three planes?

**Model:** Control computes state, data forwards packets, management operates. They fail separately.

## Q2 — Controller dies 30 minutes—what happens?

**Model:** Say whether forwarding continues and whether change/ZTP stops. If forwarding dies, the cluster is in the RTO.

## Q3 — Overlay vs underlay?

**Model:** Underlay = reachability; overlay = services/policy; fabric = integrated ops model.

## Q4 — Follow a packet through NAT and a stateful FW.

**Model:** Must include return path and asymmetry risk.

## Q5 — Why OOB management?

**Model:** Survive data/control failure; otherwise you cannot fix the outage you are in.

## Cross-links

[Planes](../04_Planes_and_Traffic_Flow/01_Control_Data_Management_Planes.md), [Centralized control](../04_Planes_and_Traffic_Flow/03_Centralized_vs_Distributed_Control.md).

---
