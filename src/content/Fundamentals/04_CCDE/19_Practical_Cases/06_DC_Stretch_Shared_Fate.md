# Case: DC stretch that shared fate

## Symptom

Active-active DCs with stretched VLANs for “seamless vMotion.” A broadcast storm / control-plane event in DC-A took DC-B with it. RTO for “independent DCs” was violated.

## R/C/A

- R: one DC loss must leave the other serving
- C: some clusters claimed they need L2
- A: stretch is required for all VMs

## Options

| A | L3 DCI + anycast/DNS; isolate true L2 to one VNI with storm controls |
| B | Dual-sided STP tuning |

**Pick A.** Challenge the cluster requirement; most apps survive L3. B still shares the flood domain.

## Lesson

Independence and stretch are opposites. Buy stretch only for a named app, in a cage.

---
