# Case: ROA maxLength Makes TE Prefix Invalid

## Scenario

You announce 203.0.113.0/24 (ROA maxLength 24) plus a /25 for inbound TE. Validators mark the /25 Invalid. Peers with “Invalid = reject” drop the TE prefix; only the /24 remains—TE fails or traffic shifts unexpectedly.

## Expected evidence

```text
show bgp ipv4 unicast 203.0.113.0/25
! path state Invalid (RPKI)
show bgp ipv4 unicast 203.0.113.0/24
! Valid
```

## Config touchpoints

- Re-issue ROA with maxLength ≥ TE more-specific, **or**
- Stop announcing longer than ROA allows.
- Never “fix” by setting Invalid = accept on Internet edges.

## Verification

After ROA update propagates via RTR: /25 Valid; peers accept; inbound TE works. See [ROA MaxLength Risks](../17_RPKI_and_Leak_Prevention/05_ROA_MaxLength_Risks.md).

## Config / verification touchpoints

Capture pre/post `show bgp` (attributes), looking-glass or collector view, and a data-plane probe. Soft-clear only the affected peer/AF after policy edits; avoid global clears during proof.

## Lesson

Origin validation is length-sensitive. TE more-specifics need ROA coverage.
## Cross-links

Use the matching troubleshooting or interview note if this case appears in an incident; keep evidence (show output + probe) with the ticket.

---
