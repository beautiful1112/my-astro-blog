# Case: LOCAL_PREF Beats a Shorter AS Path

## Scenario

Operator prepends outbound AS_PATH three times toward Provider-A expecting inbound shift. Inbound traffic stays on Provider-B because Provider-B’s customer sets LOCAL_PREF higher for B’s path. Shorter path never gets compared.

## Expected evidence

```text
! Looking glass at remote AS:
! Path via B: LP 200, AS_PATH length 2
! Path via A: LP 100, AS_PATH length 5 (with your prepend)
! Best: B
```

Locally, your advertisement looks correct; remote policy dominates inbound.

## Config touchpoints

Prefer provider communities / selective advertisement / MED (same AS only) over blind prepend. Document that prepend is a hint, not a contract—see [Interview: prepend limits](../25_Interview_Questions/08_AS_Prepending_Limitations.md).

## Verification

After applying provider “prefer this peer” community (if offered), looking glass shows LP change and traffic shifts. Prepend-only change does not move the needle.

## Config / verification touchpoints

Capture pre/post `show bgp` (attributes), looking-glass or collector view, and a data-plane probe. Soft-clear only the affected peer/AF after policy edits; avoid global clears during proof.

## Lesson

LOCAL_PREF is evaluated before AS_PATH length. Inbound TE requires influencing the remote AS’s policy.
## Cross-links

Use the matching troubleshooting or interview note if this case appears in an incident; keep evidence (show output + probe) with the ticket.

---
