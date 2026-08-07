# Case 18: BSR partition creates inconsistent RP mappings

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Topology and symptom

A PIM domain is partitioned between sites A and B long enough for each side to elect a different BSR and learn a different candidate-RP set. After partial connectivity returns, FHRs register group `G` to RP-A while some LHRs still Join RP-B. New ASM flows fail inconsistently; established SPTs continue.

## State split

```text
Site A: BSR-A -> RP(G)=RP-A -> source Registers arrive
Site B: BSR-B -> RP(G)=RP-B -> receiver (*,G) Joins arrive
```

Unless another source-discovery/synchronization design connects the RPs, sources and receivers do not rendezvous.

## Investigation

On FHR, LHR, RP-A, RP-B, and boundary routers record:

- current BSR address, priority, uptime, and scope zone;
- complete RP-set and fragment tag;
- candidate-RP advertisement expiry;
- selected `RP(G)` for the exact group;
- RPF path toward each BSR/RP;
- Bootstrap message filters or administrative-scope boundaries.

A matching BSR address alone is insufficient if one router has an incomplete/stale RP-set fragment.

## Recovery

When connectivity returns, election weight should converge on one BSR, its RP-set should replace stale mappings, and `(*,G)`/Register state should rebuild toward the selected RP. Monitor mapping expiry and tree movement; do not clear every multicast table blindly before collecting the split evidence.

## Prevention

- redundant but intentionally scoped C-BSRs and C-RPs;
- filters that allow only authorized BSR/RP addresses;
- reliable PIM Bootstrap flooding paths;
- monitoring for BSR/RP-set/mapping changes;
- synthetic new-source and new-receiver tests;
- SSM for controlled feeds that do not need rendezvous.

## Lesson

BSR redundancy distributes mappings; it does not synchronize two independently selected RPs or guarantee a partition-free control plane.
