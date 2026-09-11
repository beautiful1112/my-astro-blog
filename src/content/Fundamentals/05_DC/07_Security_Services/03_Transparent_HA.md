# Transparent HA

Between vPC Nexus cores and routers, avoid uncontrolled Layer-2 multipathing through two stateful appliances. Pin the active path, use link/path monitoring, and validate convergence and session behavior during failover.

Two transparent firewalls on a Layer-2 triangle with STP/vPC is a classic split-brain and asymmetric-state failure.

## Guardrails

- Active/passive with an explicit pinned path.
- Link and path monitoring that withdraws the dead unit from forwarding.
- Failover test: session survival or documented reset, plus reconvergence time.
- Do not treat vPC peer-link behavior as “the firewall HA protocol.”

## Related

- [Explicit service path](01_Explicit_Service_Path.md)
- [Routed firewall contexts](02_Routed_Firewall_Contexts.md)
- [Scripted failures](../14_Validation/01_Scripted_Failures.md)

---
