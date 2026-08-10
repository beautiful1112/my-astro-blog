# Core EIGRP terminology

Precise terms prevent false diagnoses. Platforms reuse words like “active,” “passive,” and “metric” with EIGRP-specific meanings that differ from OSPF or BGP—always map vocabulary to DUAL concepts, then to Cisco CLI.

## Essential definitions

| Term | Meaning |
|---|---|
| **AS (EIGRP)** | Process identity; must match for adjacency—not Internet BGP ASN semantics |
| **RID** | 32-bit EIGRP router ID; required especially for IPv6 EIGRP |
| **Neighbor** | Adjacent EIGRP speaker exchanging Hellos/RTP on an interface |
| **Topology table** | EIGRP’s database of known paths to prefixes via neighbors |
| **Reported Distance (RD)** | Neighbor’s best metric to the prefix (what they advertise) |
| **Feasible Distance (FD)** | Lowest known metric to the prefix since last Passive end—used in feasibility |
| **Successor** | Neighbor providing the best loop-free path; installed candidate |
| **Feasible Successor (FS)** | Loop-free backup meeting **RD < FD** (feasibility condition) |
| **Passive** | DUAL stable: successor known, not querying |
| **Active** | Successor lost, no FS (or recomputing): Queries outstanding |
| **RTP** | Reliable Transport Protocol over IP proto 88 |
| **SIA** | Stuck-In-Active: Active too long without needed Replies |
| **K-values** | Weights K1–K5 in composite metric; must match to form neighbors |
| **Variance** | Multiplier allowing unequal-cost multipath of feasible paths |
| **Stub** | Router role limiting query/update scope |
| **Named mode** | Modern multi-AF configuration style (`router eigrp NAME`) |
| **Classic mode** | Legacy `router eigrp <as>` configuration |

See [What EIGRP is](01_What_EIGRP_Is.md), [Successor and feasible successor](../06_Topology_Table_and_RIB/03_Successor_and_Feasible_Successor.md).

## Feasibility condition (quotable)

A path via neighbor N is a **feasible successor** if:

```text
RD(N) < FD(local)
```

That is: the neighbor’s distance to the destination is **strictly less** than this router’s feasible distance. Guarantees loop-freedom without needing a full LSDB.

## “Active” and related collisions

| Word | EIGRP meaning | Caution |
|---|---|---|
| Topology **Active** | Querying for a prefix | Not “best path” like some BGP CLIs |
| Topology **Passive** | Stable DUAL state | Not `passive-interface` |
| **passive-interface** | Stop Hellos / adjacency on iface | Opposite of “speak EIGRP here” |
| **Stuck-In-Active** | Active timer expired / SIA process | Design/query-domain problem |

## Session vs prefix scopes

Keep distinct:

1. **Neighbor adjacency** — Hello/Hold + RTP to a peer on an interface.
2. **Topology prefix state** — Passive/Active for one destination.
3. **RIB/FIB entry** — What actually forwards.

A healthy neighbor can still have many Active prefixes during failure.

## Configuration patterns (seeing terms in CLI)

### Cisco IOS / IOS XE

```text
show ip eigrp neighbors
show ip eigrp topology
show ip eigrp topology all-links
show ip protocols | section eigrp
```

Named mode:

```text
show eigrp address-family ipv4 neighbors
show eigrp address-family ipv4 topology
```

## Verification lab

1. Say aloud FD vs RD for one prefix from `show ip eigrp topology`.
2. Identify successor and any FS; then `all-links` for infeasible paths.
3. Configure `passive-interface`; confirm no neighbor, contrast with Passive route state.

## Risks

- Confusing Passive route with passive-interface.
- Calling every backup next hop an FS without checking RD < FD.
- Treating K-values as “optional tuning” rather than adjacency-critical.

## Interview framing

“I map EIGRP words carefully: FD/RD drive successor and FS; Passive/Active are DUAL states; passive-interface is an adjacency knob—and SIA means the query domain failed to answer in time.”

---
