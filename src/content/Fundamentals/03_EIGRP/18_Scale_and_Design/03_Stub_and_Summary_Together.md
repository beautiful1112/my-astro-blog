# Stub and summary together

**Stub** and **summary** solve related but different problems. Used together they are the standard EIGRP WAN scale recipe.

## Division of labor

| Mechanism | Primary job |
|---|---|
| Stub | Tell neighbors “do not treat me as transit / limit queries toward me” |
| Summary | Hide specifics; shrink RIB and limit which prefixes exist to go Active |

Stub without summary: spokes still may carry many learned prefixes (unless `receive-only` / filtering). Summary without stub: hub still queries all spokes when a prefix goes Active.

## Recommended WAN pattern

```text
! Spoke
router eigrp 100
 eigrp stub connected summary
!
! Hub interface toward spokes
interface Tunnel0
 ip summary-address eigrp 100 10.0.0.0 255.255.0.0
 ip summary-address eigrp 100 0.0.0.0 0.0.0.0
```

Spokes advertise their connected (and local summary) upward; they learn default or regional aggregate downward.

## Stub option cheat sheet

| Keyword | Advertises |
|---|---|
| `connected` | Connected |
| `static` | Static |
| `summary` | Local summaries |
| `redistributed` | Redistributed |
| `receive-only` | Nothing |

Pick the minimal set. WAN spokes: usually `connected summary`. Avoid redistributing at spokes.

## Failure vignette

Without stub: leaf VLAN flaps → hub queries 500 spokes → SIA.  
Without summary: every site /24 in every spoke RIB → memory + longer convergence.  
Both fixed: spokes stub + hub default/summary.

## Verification

```text
show ip protocols | include Stub
show ip eigrp neighbors detail
! stub peer flags
show ip route 0.0.0.0
show ip eigrp topology 10.0.0.0/16
```

## Risks

- Stub `receive-only` with no default from hub → island.
- Summarizing holes → Null0 blackhole.
- Marking a transit distribution switch as stub.

## Interview framing

“Stubs stop spokes from being query targets; summaries stop specifics from flooding—WAN scale needs both.”

## Related

- [Query Domain Architecture](02_Query_Domain_Architecture.md)
- [Hub-Spoke WAN Checklist](../17_WAN_NBMA_and_Tunnels/06_Hub_Spoke_WAN_Checklist.md)
- [Summary Blackhole No Null0](../21_Practical_Cases/04_Summary_Blackhole_No_Null0.md)

---
