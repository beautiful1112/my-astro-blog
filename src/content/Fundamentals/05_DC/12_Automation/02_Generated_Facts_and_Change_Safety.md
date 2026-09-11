# Generated facts and change safety

## Generated facts

- Leaf ASN = 65100 + rack ID.
- Router ID and VTEP loopbacks come from deterministic pools.
- Uplinks derive from leaf and spine IDs.
- VRF, VNI, RT, VLAN, and gateway are one validated object.

## Change safety

- Take platform checkpoints or candidate snapshots.
- Deploy canaries before full fabric rollout.
- Stop on unexpected diff or failed invariant.
- Rollback configuration and confirm forwarding recovery.

The pipeline owns evidence: LLDP versus intended cable map, four-way ECMP to remote VTEPs, and no unexpected MAC or route churn.

## Related

- [Intent, evidence, rollback](01_Intent_Evidence_Rollback.md)
- [Leaf intent and guardrails](../03_Underlay/04_Leaf_Intent_and_Guardrails.md)
- [Scripted failures](../14_Validation/01_Scripted_Failures.md)

---
