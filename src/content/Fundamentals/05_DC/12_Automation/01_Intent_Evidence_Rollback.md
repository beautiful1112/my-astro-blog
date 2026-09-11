# Intent, evidence, rollback

A rendered configuration is not the finish line. The pipeline must prove cabling, adjacencies, allowed routes, ECMP width, and service reachability before and after change.

1. **Source of truth** — racks · roles · addresses · policy
2. **Render** — Jinja templates · intended state
3. **Pre-check** — schema · diff · topology
4. **Deploy** — batch · checkpoint · observe
5. **Verify** — control plane · data plane · SLO

```text
Source of truth -> Render -> Pre-check -> Deploy -> Verify
                                                 \-> Rollback on fail
```

## Tool boundary

Use Nornir or Python for custom orchestration and rich state handling; Ansible for declarative, repeatable operations and broad vendor collections; Netmiko as a device transport, not the architecture of the automation system.

## Related

- [Generated facts and change safety](02_Generated_Facts_and_Change_Safety.md)
- [Leaf intent and guardrails](../03_Underlay/04_Leaf_Intent_and_Guardrails.md)
- [Scripted failures](../14_Validation/01_Scripted_Failures.md)

---
