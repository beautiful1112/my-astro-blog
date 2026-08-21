# Dual-stack design

Dual-stack means **parallel operable planes** for IPv4 and IPv6—not “enable ipv6 on interfaces” without parity in routing, security, and observability.

## Parity checklist

| Area | Must match in spirit |
|---|---|
| Routing | IGP/BGP for both; summaries |
| First hop | RA/DHCPv6 vs v4 DHCP/FHRP story |
| Security | ACL/FW/SG rules for both |
| QoS | Classify both |
| Management | Reachability OOB on both or intentional one |
| Monitoring | Telemetry and synthetics on both |

```text
Same topology intent
  v4 RIB/FIB + v6 RIB/FIB
  same failure domains
  same policy seams
```

## Happy Eyeballs and preference

Clients may prefer v6. If v6 path is broken (blackhole ACL), users see “network is down” while v4 would have worked. Dual-stack raises the cost of half-finished v6.

## Real-world — SaaS-heavy enterprise

**Brief:** Dual-stack enabled on campus; FW v6 any-any temporary; Internet v6 through different ISP than v4; users hit slow/broken v6 to SaaS.

| R / C / A | Statement |
|---|---|
| R | User apps reliable; move toward v6 feature parity in 2 quarters |
| C | One ISP better for v6; FW rule migration slow |
| A | “Turning on RA equals dual-stack done” — false |

**Decision:** Fix v6 egress/FW parity before advertising wide RA; align ISP paths; monitor Happy Eyeballs failures. Reject silent broken v6.

## Design patterns

| Pattern | Notes |
|---|---|
| Dual-stack everywhere IT | Common target |
| Dual-stack core, v4-only OT | With hard seams |
| v6-only wireless experiment | Contained SSID/VRF |

## Risks

- Asymmetric security (v6 open).
- ND storms / RA guard gaps.
- Different summarization quality than v4.

## Interview framing

“Dual-stack is parity: routing, policy, and measurement on both families—or I keep v6 contained until that parity exists.”

## Related

- [IPv6 transition strategies](02_IPv6_Transition_Strategies.md)
- [Addressing as architecture](01_Addressing_as_Architecture.md)
- [CIA triad in design](../16_Security_Design/01_CIA_Triad_in_Design.md)

## Decision checklist

1. Which numbered requirement does this choice serve?
2. Which constraint forbids the popular alternative?
3. What failure domain did we shrink or accept?
4. What is the migration/rollback story?
5. How will ops prove it on a Tuesday night?
## Failure modes to narrate

| Fault | Bad design reaction | Good design reaction |
|---|---|---|
| Link/node loss | Timers only; no alternate | Diverse path + detect + repair |
| Control-plane churn | Flood detail everywhere | Summary/stub/level + bounded domain |
| Human change error | No canary / huge blast | Module seams + staged change |
| Dependency outage | Silent shared fate | Named fate-share + residual risk |
## What to discard

Discard slogan-driven picks (“modern,” “vendor preferred,” “more redundant”) that cannot cite R/C/A. Discard designs that cannot state what still works when one module fails.

## How you prove it

- Whiteboard the module borders and plane roles in <3 minutes
- Pull a link/node in a lab or maintenance window and compare to RTO
- Show the discarded option and the requirement that killed it
## Micro-scenario (second pass)

**Brief:** Constraints tighten mid-project (budget cut, skill loss, or regulator letter).

| R / C / A | Statement |
|---|---|
| R | Preserve the original outcome metric |
| C | New hard limit appears |
| A | “Keep the old HLD unchanged” — usually false |

**Move:** Re-open only the decisions that the new constraint touches; keep invariants that still fit. Document what you demote from requirement to wish.

## One-page defense skeleton

```text
Outcome (R#)
Choice (one sentence)
Loser (one sentence)
Spend (cost/complexity/suboptimal)
Residual risk
Proof (test/KPI)
```

---
