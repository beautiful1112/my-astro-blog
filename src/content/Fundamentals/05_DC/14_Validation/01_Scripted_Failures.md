# Scripted failures

Define measurable pass criteria before purchase or migration. Test the control plane, forwarding plane, services, operations, and application-visible outcome.

## Baseline

- All expected adjacencies established
- Four-way ECMP to remote VTEPs
- Correct VRF/VNI/RT inventory
- No unexpected MAC or route churn

## Failure

- Leaf–spine link loss
- Spine and route-reflector loss
- VTEP and MLAG peer loss
- Firewall, BGW, DCI, and RP failover

## Performance

- Oversubscription at expected load
- Microburst and queue behavior
- Multicast loss and convergence
- P50 / P99 / P99.9 latency

## Operations

- Golden signals and alert routing
- Configuration drift detection
- Backup, rollback, and audit trail
- Runbook execution by another engineer

Architecture is the set of failures you choose — and the evidence that proves they stay contained.

## Related

- [Recommended default](02_Recommended_Default.md)
- [Intent, evidence, rollback](../12_Automation/01_Intent_Evidence_Rollback.md)
- [Identity to wire](../13_Troubleshooting/01_Identity_to_Wire.md)

---
