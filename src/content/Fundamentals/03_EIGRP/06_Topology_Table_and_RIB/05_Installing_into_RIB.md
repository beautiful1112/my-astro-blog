# Installing into RIB

DUAL selecting a successor places a candidate into the EIGRP topology results; the **global RIB** (and then FIB) installs it only if EIGRP wins **administrative distance** (and other install checks). Knowing AD defaults prevents “EIGRP looks fine but traffic uses OSPF” mysteries.

## Administrative distance (Cisco common)

| Route type | AD |
|---|---|
| EIGRP **internal** | **90** |
| EIGRP **summary** | **5** (Cisco summary AD) |
| EIGRP **external** | **170** |
| OSPF | 110 |
| IS-IS | 115 |
| eBGP | 20 |
| iBGP | 200 |
| Connected | 0 |
| Static | 1 |

Internal EIGRP (90) beats OSPF (110). **External** EIGRP (170) **loses** to OSPF—classic redistribution trap.

Related: [Control plane versus data plane](../02_Fundamentals/04_Control_Plane_vs_Data_Plane.md), [Successor and feasible successor](03_Successor_and_Feasible_Successor.md).

## Variance and multipath

```text
router eigrp 100
 variance 2
 maximum-paths 4
```

A feasible path with metric ≤ variance × successor metric may install for UCMP. Paths must still be feasible. CEF then load-shares per platform hashing.

## Mental install pipeline

```text
Topology successor(s)
  -> AD competition vs other protocols
  -> RIB install
  -> FIB / hardware
```

## Configuration patterns

### Cisco IOS / IOS XE

```text
router eigrp 100
 network 10.0.0.0 0.255.255.255
 variance 2
!
! Dangerous without filters:
router eigrp 100
 redistribute ospf 1 metric 100000 100 255 1 1500
```

Externals become AD 170 unless tuned with `distance` carefully.

## Verification

```text
show ip eigrp topology 10.10.10.0/24
show ip route 10.10.10.0
show ip route eigrp
show ip cef 10.10.10.10
```

Lab checks:

1. Internal EIGRP vs OSPF same prefix → EIGRP wins.
2. Redistribute into EIGRP as external vs OSPF → OSPF wins.
3. Variance 2 with FS metrics; confirm multiple RIB next hops.

## Risks

- Redistribution creating external EIGRP that never installs vs OSPF.
- Assuming topology successor guarantees RIB line.
- Variance without CEF understanding → uneven traffic.

## Interview framing

“EIGRP internals install at AD 90 and externals at 170—so a topology successor can still lose the RIB, especially after redistribution into OSPF’s 110.”

---
