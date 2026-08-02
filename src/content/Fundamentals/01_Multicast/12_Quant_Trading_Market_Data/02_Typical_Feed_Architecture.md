# Typical market-data architecture

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

```mermaid
flowchart LR
    E["Exchange engine"] --> A["Feed A"]
    E --> B["Feed B"]
    A --> NA["Independent network A"]
    B --> NB["Independent network B"]
    NA --> H["Line arbitrator"]
    NB --> H
    H -->|"small gap"| RR["Retransmission"]
    H -->|"large gap / late start"| SR["Snapshot or recovery"]
    H --> OB["Book / strategy"]
```

Nasdaq MoldUDP64, CME MDP 3.0, and NYSE feeds all demonstrate variants of sequenced UDP multicast, redundant lines, and retransmission/refresh workflows.

