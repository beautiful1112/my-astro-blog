# Null0 discard route

When EIGRP creates a summary, the summarizing router installs a **discard route** to **Null0** for the aggregate (administrative distance typically **5** for EIGRP summaries on Cisco). Traffic destined to the summary that does not match a longer-prefix component is dropped locally instead of following a default or less-specific path that might loop.

## Why it is required

Without Null0:

1. Router advertises `10.10.0.0/16` upstream.
2. Component `10.10.1.0/24` fails and is withdrawn locally.
3. Packet for `10.10.1.1` still arrives (upstream believes summary).
4. If the router forwards via default back upstream → **loop** until TTL expires.

Null0 breaks the loop: unmatched component space inside the summary is discarded.

```text
D       10.10.0.0/16 is a summary, Null0, AD 5
C       10.10.2.0/24 directly connected
```

Longest-match still prefers components when present; Null0 only catches holes.

## Verification

```text
show ip route 10.10.0.0
show ip route summary
show ip eigrp topology 10.10.0.0/16
```

## Design caveats

- AD 5 beats many internal routes—ensure you are not summarizing space that should be reached via another protocol’s more-specific elsewhere on **this same** router incorrectly.
- If all components disappear, platforms may withdraw the summary (desired) or keep advertising until configured otherwise—know your code train; Null0 remains the safety net while the summary exists.
- Overlapping summaries from two DCs: Null0 on each is local; global traffic engineering still needs correct advertisement preference.

## Lab proof

1. Advertise summary with two components up → ping remote into each component works.
2. Shut both component interfaces → packets to those destinations hitting this router should hit Null0 (not bounce upstream).
3. Confirm upstream eventually loses or keeps summary per platform rules; either way local discard prevented the loop during the window.

```text
show ip route 10.10.1.1
! when component down: recursively to Null0 via summary
```

## Interview framing

“EIGRP summary installs Null0 so packets for missing components are discarded instead of looping on the aggregate. AD is commonly 5 on Cisco.”

## Related

- [Interface summarization](03_Interface_Summarization.md)
- [Summary metric and component min](05_Summary_Metric_and_Component_Min.md)
- [Summarization as query boundary](../09_Query_Scope_and_Convergence/04_Summarization_as_Query_Boundary.md)

---
