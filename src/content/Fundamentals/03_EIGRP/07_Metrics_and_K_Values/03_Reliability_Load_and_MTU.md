# Reliability, load, and MTU

Classic EIGRP *can* incorporate **load** (K2) and **reliability** (K4/K5) into the composite metric, and EIGRP carry **MTU** in routing TLVs for path MTU awareness—but **default deployments ignore load/reliability in the metric**, and MTU is **not** part of the classic composite calculation historically used for successor selection.

## Defaults vs optional components

| Input | Default metric use | When it appears |
|---|---|---|
| Bandwidth | Yes (K1=1) | Always under defaults |
| Delay | Yes (K3=1) | Always under defaults |
| Load | No (K2=0) | Only if K2 enabled |
| Reliability | No (K5=0) | Only if K5 enabled |
| MTU | Not in composite formula | Carried/exchanged; lowest MTU along path tracked |

Related: [Composite metric formula](01_Composite_Metric_Formula.md), [K-values and mismatch](04_K_Values_and_Mismatch.md).

## Why load/reliability stay off

```text
Load and reliability change over time
  -> metric churn
  -> topology Updates
  -> possible successor flaps
```

Operational consensus: engineer with **bandwidth/delay** (and design), not live load feedback in the IGP metric.

## MTU practical note

EIGRP may report minimum path MTU in topology details for awareness. That does **not** replace discovering real PMTUD/MSS issues for TCP sessions or oversized Update problems. Do not claim “EIGRP metric includes MTU” in interviews.

## Configuration patterns (what not to do casually)

### Cisco IOS / IOS XE

```text
! Non-default — lab only unless entire domain matches
router eigrp 100
 metric weights 0 1 1 1 1 1
```

Restoring defaults:

```text
metric weights 0 1 0 1 0 0
```

## Verification

```text
show ip protocols | include K-
show ip eigrp topology 10.10.10.0/24
show interfaces | include reliability|load|MTU
```

Lab: enable K2 briefly on two routers only; watch metric chatter under traffic; then restore defaults.

## Risks

- Enabling K2/K5 in production for “smart metrics.”
- K mismatch during experiments → total neighbor loss.
- Interview confusion claiming MTU feeds the composite formula.

## Interview framing

“By default EIGRP ignores load and reliability in the composite metric, and MTU is not part of that classic formula—leave K2/K4/K5 at zero unless the whole domain is designed for them.”

---
