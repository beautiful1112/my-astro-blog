# Summary metric and component min

The metric advertised for an EIGRP summary is derived from the **component prefixes** that the summary covers—not chosen arbitrarily by the engineer (unless offset/policy alters paths feeding the summary).

## Typical Cisco behavior

For a summary on an interface, EIGRP examines metrics of matching components in the topology table and builds a summary metric from those components. Common teaching model:

- Use the **minimum (best) bandwidth** among components’ paths as represented for the summary construction, and
- Use **sum / worst-case delay** style aggregation per implementation rules—

Exact composite construction follows the same K-value formula family as ordinary routes; the important ops takeaway: **summary metric reflects component metrics**, often dominated by the **best (lowest) component metric** so the aggregate remains attractive enough, while still changing when components change.

When the best component is withdrawn, the summary metric **recalculates** from remaining components → Update upstream. That can cause mild churn at the summary edge even though far-end tables stay on one prefix.

```text
Components:
  10.10.1.0/24  metric 1000
  10.10.2.0/24  metric 5000
Summary 10.10.0.0/16 advertises based on component set
(often tracking the best component’s influence)
```

## Why this matters

- Upstream may prefer one summarizing router over another because its components yield a better summary metric—not because of an explicit “summary preference” knob.
- Adding a very good component behind a summary can suddenly pull traffic to that exit.
- Offset lists applied to components change the summary indirectly.

## Verification

```text
show ip eigrp topology 10.10.0.0/16
show ip eigrp topology 10.10.1.0/24
show ip route 10.10.0.0
```

Compare summary metric before/after shutting a component interface in lab.

## Risks

- Assuming summary metric is static.
- Hiding a poor path behind a summary that still looks excellent because one good component remains.
- Unequal dual-DC summaries causing persistent asymmetric traffic.

## Interview framing

“Summary metric is computed from components (min/best influence is the usual mental model). Withdraw components → metric can change and Update neighbors even though the prefix length stays the same.”

## Related

- [Interface summarization](03_Interface_Summarization.md)
- [Metrics and K-values](../07_Metrics_and_K_Values/README.md)
- [Leak maps and specifics](06_Leak_Maps_and_Specifics.md)

---
