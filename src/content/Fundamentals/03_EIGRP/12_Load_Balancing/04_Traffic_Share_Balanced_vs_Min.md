# Traffic share balanced vs min

When multiple unequal-cost EIGRP paths are installed, **traffic-share** controls how shares are computed for load distribution among those next hops.

## Modes

| Mode | Behavior |
|---|---|
| **balanced** (typical default) | Share inversely related to metric—better (lower metric) paths get more traffic |
| **min** | All traffic uses the minimum-metric path among installed next hops; alternates present for fast failover but not for sharing |

```text
router eigrp 100
 traffic-share balanced
! or
 traffic-share min across-interfaces
```

Named mode: under topology base (command availability varies—verify release).

## When min is useful

- You installed UCMP paths only as hot standbys but do not want production traffic on the slow link.
- Variance was set for FS installation / local repair visibility, not for sharing.

Note: local repair on successor loss still needs the alternate in topology/RIB as designed; `traffic-share min` keeps forwarding on the best while the worse path remains installed.

## Balanced caveats

Share ratios follow metric proportions, **not** configured bandwidth percentages directly. A path with 3× worse metric gets roughly 1/3 the share—CEF hashing still sends whole flows, so small flows look uneven.

## Configuration placement

```text
! Classic process
router eigrp 100
 traffic-share balanced

! Named — topology base when supported
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  topology base
   traffic-share balanced
```

If the image rejects `traffic-share` under named topology, keep variance conservative and document CEF behavior for that platform.

## Verification

```text
show ip protocols
show ip route 10.1.1.0
show ip cef 10.1.1.0/24 detail
! Look for traffic share counts / ratios in CEF detail where supported
```

## Interview framing

“balanced shares by metric; min pins forwarding to the best installed path while keeping backups. UCMP install ≠ UCMP share if traffic-share min.”

## Related

- [Variance unequal cost](02_Variance_Unequal_Cost.md)
- [UCMP pitfalls](06_UCMP_Pitfalls.md)

---
