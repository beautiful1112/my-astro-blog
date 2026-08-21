# IS-IS for SP and MPLS

IS-IS is a common **SP underlay** for MPLS/SR because of TLV extensibility, dual-stack habits, and operational culture around levels and TE. Enterprise may choose it too—but skill is a constraint.

## Why SPs often pick IS-IS

| Reason | Design impact |
|---|---|
| TLV flexibility | IPv6, SR, TE attributes |
| Level hierarchy | Scale national networks |
| Multi-topology / multi-AF history | Parallel families |
| Ops familiarity in SP NOCs | Fast incident response |

```text
CE--PE (BGP/VPN) -- P/P (IS-IS + LDP or SR) -- PE--CE
Underlay = IS-IS reachability + labels/SID
Overlay = L3VPN/L2VPN/EVPN
```

## Coupling to MPLS/SR

| Underlay choice | Notes |
|---|---|
| IS-IS + LDP | Classic MPLS |
| IS-IS + SR-MPLS | SID in IGP; TI-LFA culture |
| IS-IS + SRv6 | Newer; skill/platform constraint |

IGP design (levels, overload bit, flooding scope) still matters when labels fly.

## Real-world — enterprise adopts SP-style core

**Brief:** Large bank builds private MPLS; team knows OSPF; vendor proposes IS-IS+SR.

| R / C / A | Statement |
|---|---|
| R | Dual-stack underlay with FRR for payment VRF |
| C | 90 days to cutover; OSPF experts dominate |
| A | “IS-IS required for MPLS” — false |

**Decision:** OSPF+SR or OSPF+LDP acceptable if platform supports; pick IS-IS only if training and timeline allow. Reject religion without constraint analysis.

## Design checklist for IS-IS under MPLS

1. Contiguous L2 (or single level with intentional flatness at small scale).
2. Overload bit / maintenance behavior defined.
3. SID/label allocation plan.
4. Failure domains aligned to POPs.
5. VPN policy stays in BGP—not IGP.

## Risks

- Treating IS-IS as automatic TE excellence without FRR design.
- Mixing migration of IGP and VPN in one big bang.
- Underestimating ops retraining.

## Interview framing

“IS-IS is a strong SP underlay for MPLS/SR, but I choose it when scale and skill fit—MPLS needs a sound IGP hierarchy regardless of logo.”

## Related

- [Levels and L1/L2 placement](02_Levels_and_L1L2_Placement.md)
- [Why MPLS exists](../10_MPLS_VPN_and_EVPN/01_Why_MPLS_Exists.md)
- [Segment Routing in design](../10_MPLS_VPN_and_EVPN/05_Segment_Routing_in_Design.md)

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
