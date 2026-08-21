# Segment Routing in design

Segment Routing (SR) places path intent in the **packet’s segment list / SID** while simplifying or replacing LDP/RSVP-TE state. CCDE cares when SR’s operational model fits—not SID trivia alone.

## What SR changes

| Classic MPLS | SR-MPLS / SRv6 |
|---|---|
| LDP/RSVP state per LSP | IGP-distributed SIDs (+ policies) |
| TE often RSVP-heavy | SR policies / Flex-Algo / TI-LFA |
| Per-flow state risk | Different state location |

```text
PE --(IGP + SIDs)-- P -- PE
Optional: SR policy for special classes
Default: best-effort follows IGP topology
```

## Design benefits

| Benefit | When it matters |
|---|---|
| TI-LFA culture | Aggressive RTO on underlay |
| Simpler label distribution | Large P fabrics |
| Traffic steering without full mesh RSVP | Hotspots, dual planes |
| Unified IPv6 story (SRv6) | Greenfield IPv6-centric |

## Costs / constraints

- Platform and code train readiness.
- Operator training (new failure language).
- SRv6 MTU and hardware.
- Policy sprawl if every app gets a custom SR policy.

## Real-world — national backbone FRR

**Brief:** Bank private core; RSVP-TE brittle; need sub-50 ms repair for payment VRF underlay; OSPF team willing to learn SR-MPLS.

| R / C / A | Statement |
|---|---|
| R | Link failure local repair <50 ms on core |
| C | No SRv6 hardware wave this year |
| A | “SR automatically fixes VPN design” — false |

**Decision:** SR-MPLS with TI-LFA on core; BGP VPN unchanged. Reject SRv6 until platforms catch up; reject “SR as VPN replacement.”

## Placement guidance

| Use SR for | Keep elsewhere |
|---|---|
| Underlay reach + FRR | VPN membership (BGP) |
| Limited steered classes | Per-user micro policies at scale without controller |

## Risks

- Mixing LDP and SR carelessly during migration.
- SR policies as invisible underlay spaghetti.
- Ignoring controller dependency for complex policies.

## Interview framing

“I use SR to simplify underlay steering and FRR when platforms and skills fit—I still keep VPN policy in BGP and treat SR migration as a phased underlay project.”

## Related

- [Why MPLS exists](01_Why_MPLS_Exists.md)
- [IS-IS for SP and MPLS](../08_ISIS_Design/03_ISIS_for_SP_and_MPLS.md)
- [Fast convergence design](../06_Routing_Protocol_Selection/04_Fast_Convergence_Design.md)

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

---
