# Three EIGRP tables

EIGRP operations are easiest when you always name **which table** you are looking at. There are three:

| Table | Contents | Primary CLI |
|---|---|---|
| **Neighbor** | Live adjacencies / RTP peers | `show ip eigrp neighbors` |
| **Topology** | Paths to prefixes via neighbors (DUAL) | `show ip eigrp topology` |
| **Routing (RIB)** | What competes for forwarding install | `show ip route eigrp` |

```text
Neighbor table  --Updates-->  Topology table  --successor-->  RIB/FIB
                     DUAL
```

Related: [Neighbor table](../05_Neighbor_Discovery/03_Neighbor_Table.md), [Control plane versus data plane](../02_Fundamentals/04_Control_Plane_vs_Data_Plane.md).

## What each table proves

| If this looks healthy… | You still must verify… |
|---|---|
| Neighbor up | Prefix in topology, Passive, successor |
| Topology has successor | RIB install (AD), FIB |
| RIB has EIGRP route | Correct next hop / no longer-match steal |

## Not an LSDB

The topology table is **not** a full-network link-state database. It stores destinations and metrics learned **through neighbors** (plus locally originated). `all-links` shows additional learned paths that failed feasibility—still neighbor-advertised DV info.

## Configuration patterns (seeing all three)

### Cisco IOS / IOS XE

```text
show ip eigrp neighbors
show ip eigrp topology
show ip route eigrp
show ip cef 10.10.10.10
```

Named:

```text
show eigrp address-family ipv4 neighbors
show eigrp address-family ipv4 topology
show ip route eigrp
```

## Verification lab

1. Pull a cable: neighbor gone → topology entries via that peer gone → RIB may install FS or go Active.
2. Keep neighbor, filter prefix: neighbor remains, topology misses prefix.
3. Inject competing OSPF route: topology successor remains, RIB may hide EIGRP.

## Risks

- Troubleshooting only `show ip route` during Active events.
- Calling topology an LSDB in interviews.
- Assuming RIB presence means Passive forever.

## Interview framing

“EIGRP has neighbor, topology, and routing tables—adjacency, DUAL paths, then RIB install—and I never skip levels when a prefix is missing.”

---
