# K-values and mismatch

**K-values** are the six weights (plus historical TOS field in the command) that define how EIGRP computes metrics. **Neighbors must advertise identical K-values** in Hellos; any mismatch means **no adjacency**—often without a friendly error if you are not looking for it.

## Defaults

```text
K1 = 1   bandwidth
K2 = 0   load
K3 = 1   delay
K4 = 0   reliability
K5 = 0   reliability
```

CLI:

```text
metric weights 0 1 0 1 0 0
!         TOS K1 K2 K3 K4 K5
```

Related: [Neighbor formation requirements](../05_Neighbor_Discovery/01_Neighbor_Formation_Requirements.md), [Composite metric formula](01_Composite_Metric_Formula.md), [Common neighbor mismatches](../05_Neighbor_Discovery/07_Common_Neighbor_Mismatches.md).

## Mismatch behavior

```text
R1: K1=1 K3=1
R2: K1=1 K3=1 K2=1
-> Hellos exchanged, adjacency refused / ignored
-> empty neighbor table
```

Wide-metrics / named-mode environments still require consistent metric formula parameters across peers in that AF.

## Change control

| Practice | Reason |
|---|---|
| Change K-values domain-wide in a window | Avoid split adjacency islands |
| Prefer delay/BW TE over new Ks | Less adjacency risk |
| Lab mismatch once | Memorize the symptom |

## Configuration patterns

### Cisco IOS / IOS XE — classic

```text
router eigrp 100
 metric weights 0 1 0 1 0 0
```

### Named mode

```text
router eigrp CAMPUS
 address-family ipv4 unicast autonomous-system 100
  metric weights 0 1 0 1 0 0
 exit-address-family
```

Verify both sides after any change; do not assume inheritance across VRFs/AFs.

## Verification

```text
show ip protocols
show ip eigrp neighbors
debug eigrp packets hello
```

Lab: set K2=1 on one router; confirm neighbor loss; restore; confirm recovery.

## Risks

- “Tuning” K-values on a single WAN edge router.
- Copy-paste `metric weights` from an old document with K5≠0.
- Mixing classic and named configs with different weights during migration.

## Interview framing

“K-values must match exactly to form an EIGRP neighbor—defaults are K1=K3=1 and others 0, and a mismatch usually looks like a silent empty neighbor table.”

---
