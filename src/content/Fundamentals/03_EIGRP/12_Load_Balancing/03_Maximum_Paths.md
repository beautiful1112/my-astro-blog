# Maximum paths

`maximum-paths` caps how many EIGRP next hops install in the RIB for a prefix (ECMP or UCMP). It does not create paths; it only limits how many eligible ones are used.

## Defaults and range

Cisco IOS/XE commonly defaults to **4**; configurable range is platform-specific (often 1–32). Setting `maximum-paths 1` forces single-path forwarding even when ECMP/UCMP candidates exist.

```text
router eigrp 100
 maximum-paths 6

! Named — under topology base
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  topology base
   maximum-paths 6
```

## Interaction with variance

Eligible set = paths that pass equality (ECMP) or variance+FC (UCMP).  
Installed set = best eligible paths until `maximum-paths` count is reached.

If six FS paths fit variance but `maximum-paths 4`, only four install (lowest metrics preferred).

## RIB vs CEF vs hardware

Some platforms further limit ECMP members in hardware. Control plane may show four paths while forwarding uses fewer—verify CEF/FIB, not only EIGRP topology.

## Choosing a value

| Scenario | Guidance |
|---|---|
| Dual equal uplinks | `2` is enough |
| Quad ECMP core | `4` (often default) |
| Many FS with variance | Cap low to avoid spraying onto poor links |
| Deterministic single path | `1` |

## Verification

```text
show ip protocols          ! Maximum path: N
show ip route 10.1.1.0
show ip cef 10.1.1.0/24 detail
```

## Risks

- Raising maximum-paths on routers with many low-quality FS links overshares traffic onto slow backup circuits (especially with high variance).
- Lowering to 1 during troubleshooting and forgetting to restore.

## Interview framing

“maximum-paths is a cap on installed next hops after ECMP/UCMP eligibility. Variance selects candidates; maximum-paths truncates the set.”

## Related

- [Equal-cost multipath](01_Equal_Cost_Multipath.md)
- [Variance unequal cost](02_Variance_Unequal_Cost.md)
- [Traffic share balanced vs min](04_Traffic_Share_Balanced_vs_Min.md)

---
