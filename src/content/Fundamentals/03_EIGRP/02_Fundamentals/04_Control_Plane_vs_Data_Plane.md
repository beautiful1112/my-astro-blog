# EIGRP control plane versus data plane

EIGRP learning a route does **not** guarantee forwarding. The control plane forms neighbors, runs DUAL, and populates the topology table; the data plane forwards using RIB/FIB entries after administrative-distance competition and hardware programming succeed. Outages often sit on that seam—especially Active routes, AD losses, and variance multipath surprises.

## Pipeline

```text
Hello / adjacency
  -> Update / topology entry (RD, metrics, via)
  -> DUAL: successor (+ FS if feasible) or Active query
  -> RIB install competition (AD 90 internal / 170 external)
  -> FIB / hardware programming
  -> outbound Update to neighbors (stub/summary/policy may filter)
```

A prefix can be **Passive with a successor in the topology table** yet fail useful forwarding because:

- another protocol wins the RIB (e.g. OSPF AD 110 vs EIGRP external 170—or static);
- the outgoing interface/next hop is down while control state is stale briefly;
- variance installs multiple paths but CEF/hashing or PBR diverges from expectation;
- summarization/null0 discard blackholes more-specific holes;
- the route is Active: control plane is still searching—traffic may use last path or drop depending on platform timing.

“Neighbor up” proves none of the stages after adjacency.

## Stage isolation for troubleshooting

| Symptom | Likely stage | First evidence |
|---|---|---|
| No neighbor | Hello / AS / K / subnet / auth / passive | `show ip eigrp neighbors`, interface |
| Neighbor up, prefix missing | Update scope / stub / filter / not originated | topology table, `show ip protocols` |
| In topology, Active | No FS; query outstanding | topology flags, SIA timers |
| Passive successor, not in RIB | AD / compete / reject | `show ip route` vs topology |
| In RIB, wrong path/traffic | FIB / LPM / variance / summary | CEF, longer match, traceroute |
| Local OK, neighbor lacks prefix | Outbound stub/summary/distribute-list | neighbor stub flags, advertised set |

Related: [Three EIGRP tables](../06_Topology_Table_and_RIB/01_Three_EIGRP_Tables.md), [Installing into RIB](../06_Topology_Table_and_RIB/05_Installing_into_RIB.md).

## Interactions

| Mechanism | Interaction |
|---|---|
| BFD | Faster *adjacency* death; does not install routes by itself |
| Stub | Limits what control plane asks/answers—affects recovery paths |
| Redistribution | Creates externals (AD 170) that often lose to internals of other IGPs |
| Summary null0 | Control-plane reachability with deliberate discard for holes |

## Configuration patterns (exposing the seam)

### Cisco IOS / IOS XE

```text
! Observe AD competition: OSPF internal vs EIGRP external
router ospf 1
 network 10.0.0.0 0.0.0.255 area 0
router eigrp 100
 redistribute ospf 1 metric 100000 100 255 1 1500
```

Lab both directions carefully; the point is RIB winner ≠ “EIGRP neighbor healthy.”

## Verification

```text
show ip eigrp topology 10.10.10.0/24
show ip route 10.10.10.0
show ip cef 10.10.10.10
show ip eigrp topology | include Active
```

Lab checks:

1. Topology successor present, RIB missing → document AD winner.
2. Force Active; ping during query; note control vs data behavior.
3. Add summary; traceroute to hole → null0 vs unexpected more-specific.

## Risks

- Clearing neighbors because ping fails → destroys adjacency/SIA evidence.
- Trusting “EIGRP route in topology” as forwarding proof.
- Ignoring Active state during change windows.

## Interview framing

“EIGRP control plane runs neighbors and DUAL; packets follow only after RIB/FIB install—neighbor up never proves the prefix is Passive, installed, or correctly forwarded.”

---
