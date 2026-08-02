# What multicast is

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

IP multicast sends one IP datagram to a **group address**. The network creates copies only where paths to interested receivers diverge. Membership is dynamic, a source does not need to be a member, and delivery remains best-effort: multicast does not inherently guarantee arrival, ordering, non-duplication, congestion control, or recovery.

```mermaid
flowchart LR
    S["Source sends one packet to G"] --> R1["Router receives one copy"]
    R1 --> R2["Branch 1"]
    R1 --> R3["Branch 2"]
    R2 --> A["Receiver A"]
    R2 --> B["Receiver B"]
    R3 --> C["Receiver C"]
```

The scalability benefit is that the source transmits once, common links carry one copy, and replication happens at tree branches rather than at the source for every receiver.

