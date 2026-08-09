# Case: MED Does Not Influence Two Upstreams

## Scenario

Site advertises MED 50 to Upstream-A and MED 10 to Upstream-B expecting B to be preferred globally. Traffic still enters via A. Engineers “raise MED debugging” for days.

## Expected evidence

MED is compared (by default) only among paths from the **same** neighboring AS. A and B are different ASNs—each picks independently; your MED to A never competes with your MED to B inside a third AS.

```text
show bgp ipv4 unicast neighbors <A> advertised-routes
show bgp ipv4 unicast neighbors <B> advertised-routes
! MEDs present, but unrelated ASes do not compare them against each other
```

## Config touchpoints

Use LOCAL_PREF inside your AS for outbound; for inbound across different providers use communities, prepend, more-specifics (carefully), or capacity engineering—not cross-AS MED myths.

`bgp always-compare-med` changes local comparison behavior; it does not force remote ASes to honor your MED across providers.

## Verification

Confirm decision point with a looking glass inside each provider and in a third AS. See [LOCAL_PREF vs MED interview](../25_Interview_Questions/03_LOCAL_PREF_vs_MED.md).

## Config / verification touchpoints

Capture pre/post `show bgp` (attributes), looking-glass or collector view, and a data-plane probe. Soft-clear only the affected peer/AF after policy edits; avoid global clears during proof.

## Lesson

MED scope is neighbor-AS scoped unless an explicit (and rare) policy says otherwise.
## Cross-links

Use the matching troubleshooting or interview note if this case appears in an incident; keep evidence (show output + probe) with the ticket.

---
