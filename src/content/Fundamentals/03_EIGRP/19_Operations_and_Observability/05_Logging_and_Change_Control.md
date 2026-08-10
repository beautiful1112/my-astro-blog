# Logging and change control

Most EIGRP outages are change-induced: K-values, auth keys, summaries, stubs, redistribute maps, bandwidth statements.

## Logging that matters

```text
logging buffered 1000000 informational
logging trap informational
!
show logging | include EIGRP|DUAL|SIA|adj
```

Send adjacency and SIA-related messages to SIEM with timestamps synced via NTP.

## Change control checklist

Before:

- [ ] Snapshot `show ip eigrp neighbors detail`
- [ ] Snapshot topology summary + critical prefixes
- [ ] Confirm NTP
- [ ] Peer notified if auth/K-value/AS change
- [ ] Rollback commands staged

During:

- [ ] One logical change at a time
- [ ] Verify neighbors after each step
- [ ] Watch `topology active`

After:

- [ ] Re-baseline counts
- [ ] Update network source of truth / diagrams
- [ ] Attach show outputs to ticket

## High-risk changes (require paired window)

| Change | Risk |
|---|---|
| K-values | Silent adjacency loss |
| Auth key without overlap | Hard down |
| `passive-interface` on transit | Silent isolation |
| Summary without Null0 awareness | Blackhole |
| Mutual redistribution edit on one border only | Loop |
| Bandwidth on tunnel | Metric reordering |

## Forbidden casual ops

- `debug eigrp packet` on hub “to see.”
- Clearing all neighbors as first step.
- Disabling split horizon without design review.
- Raising SIA timer instead of fixing stubs.

## Interview framing

“Treat K-values, auth, summaries, and redistribution as high-risk changes—snapshot neighbors and topology before touching them.”

## Related

- [Baseline Health Checks](04_Baseline_Health_Checks.md)
- [Operational Auth Failures](../16_Authentication_and_Security/06_Operational_Auth_Failures.md)
- [K-Values Mismatch Silent](../21_Practical_Cases/01_K_Values_Mismatch_Silent.md)

---
