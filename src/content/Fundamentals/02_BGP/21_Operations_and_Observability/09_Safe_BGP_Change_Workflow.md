# Safe BGP Change Workflow

Treat every policy edit as a controlled experiment with a predicted delta.

## Before

1. State intended received / selected / advertised route deltas (include VIP prefixes).
2. Snapshot peer state, prefix counts, exact paths, traffic, and latency baselines.
3. Validate policy offline (prefix-list simulation, Junos `test policy`, dry-run where available).
4. Confirm rollback syntax, out-of-band access, and abort thresholds.
5. Note interactions: max-prefix, RPKI, `local-as`, SoO, ORF, conditional advertisement, AIGP enablement.

## During

1. Apply to one bounded peer/family when possible.
2. Prefer route-refresh / soft re-evaluation over `clear bgp *`.
3. Watch BMP/collector and local counters for unexpected cliffs.
4. Verify FIB and bidirectional forwarding for VIP destinations.

## After

1. Compare snapshots to intent (attributes, not only prefix presence).
2. External looking-glass confirmation for advertisement changes (prepend, communities).
3. Close only when control plane, FIB, and service metrics agree.

## VIP change template (checklist)

- [ ] Predicted best NH for each VIP
- [ ] Predicted advertised deltas to Internet vs exchange
- [ ] Abort: loss > X ms equivalent / latency > Y / prefix cliff
- [ ] Rollback peer/AF mapped
- [ ] Market window OK

## Explicitly avoid

- `clear bgp all` / `clear bgp *` as a routine policy tool.
- Enabling `allowas-in` or `as-override` without SoO on dual-homed VPN sites.
- Changing LOCAL_PREF and AIGP in the same window without a predicted winner.

For trading calendars, schedule around market hours—see [Change Control and Evidence](../22_Quant_Trading_Networks/10_Change_Control_and_Evidence.md).

---
