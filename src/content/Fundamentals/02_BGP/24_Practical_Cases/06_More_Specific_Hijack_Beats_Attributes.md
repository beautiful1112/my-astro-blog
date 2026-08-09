# Case: More-Specific Hijack Beats Better Attributes

## Scenario

You originate 203.0.113.0/24 with excellent attributes. Attacker (or leak) originates 203.0.113.0/25 and 203.0.113.128/25. Victims forward to the attacker for those destinations despite your “better” AS_PATH on the /24.

## Expected evidence

```text
! Victim RIB:
! 203.0.113.0/25  via attacker (longest match)
! 203.0.113.0/24  via you
traceroute 203.0.113.10  # follows /25
```

RPKI may show Valid for both if ROAs allow /25, or Invalid if maxLength is /24—see ROA maxLength case below.

## Config touchpoints

- Originate covering + more-specifics intentionally only when ROAs allow.
- Monitor IRR/RPKI and prefix visibility for unexpected more-specifics.
- RTBH/FlowSpec playbooks for your own space under attack.

## Verification

Looking glasses show the more-specific; traffic to that half follows longest match regardless of your /24 attributes.

## Config / verification touchpoints

Capture pre/post `show bgp` (attributes), looking-glass or collector view, and a data-plane probe. Soft-clear only the affected peer/AF after policy edits; avoid global clears during proof.

## Lesson

Longest-prefix match is a forwarding rule across different lengths; attribute “wins” only among same NLRI.
## Cross-links

Use the matching troubleshooting or interview note if this case appears in an incident; keep evidence (show output + probe) with the ticket.

---
