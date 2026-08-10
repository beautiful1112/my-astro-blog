# Equal-cost multipath

When multiple successors share the **same composite metric**, EIGRP installs up to `maximum-paths` next hops into the RIB for **equal-cost multipath (ECMP)**. Each equal path is a successor; FD equals that shared metric.

## Requirements

- Identical local metrics via each neighbor (after K-value formula).
- Paths accepted by policy/filters.
- Count ≤ `maximum-paths` (platform default often 4).

FC is automatically satisfied among true equal-cost successors for installation purposes; additional **worse** paths still need variance + FC to join UCMP.

```text
via 192.0.2.1 (30720/28160), GigabitEthernet0/0
via 192.0.2.5 (30720/28160), GigabitEthernet0/1
FD is 30720
! two successors, ECMP
```

## Classic / named config

```text
router eigrp 100
 maximum-paths 4

! Named
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  topology base
   maximum-paths 4
```

## CEF behavior

Once RIB has multiple equal next hops, CEF performs per-session/per-dest sharing (platform dependent). Unequal interface speeds with equal EIGRP metrics (delay tuned) can still ECMP—metrics lie if bandwidth/delay not truthful.

## Making metrics equal

With default K-values, equal **minimum bandwidth along the path** and equal **cumulative delay** dominate. Two links with different speeds will not ECMP until you adjust delay (or bandwidth) deliberately—prefer fixing capacity design over fake equality.

## Verification

```text
show ip route 10.1.1.0
show ip eigrp topology 10.1.1.0/24
show ip cef 10.1.1.0 detail
```

## Interview framing

“ECMP = equal successor metrics up to maximum-paths. No variance needed. Truthful bandwidth/delay keeps ECMP sane.”

## Related

- [Variance unequal cost](02_Variance_Unequal_Cost.md)
- [Maximum paths](03_Maximum_Paths.md)
- [Successor selection](../08_DUAL_and_Feasibility/04_Successor_Selection.md)

---
