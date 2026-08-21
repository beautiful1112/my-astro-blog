# IPv6 transition strategies

Transition is a **program**, not a toggle. Choose mechanisms from application needs, overlap reality, and operational skill—not from a single blog favorite.

## Strategy map

| Strategy | Idea | Fits |
|---|---|---|
| Dual-stack | IPv4+IPv6 coexist | Most enterprises |
| IPv6-mostly / 464XLAT | Prefer v6 with translation | Mobile/SP-like |
| Tunneling (DS-Lite, etc.) | Carry across v4/v6 | SP access |
| Translation (NAT64/DNS64) | v6 clients to v4 servers | Controlled edges |
| IPv4-only leftover | Temporary islands | Legacy OT |

```text
Prefer: dual-stack core + edges with clear SLOs
Avoid:  random tunnels as long-term architecture
```

## Decision drivers

| Driver | Push toward |
|---|---|
| Public IPv4 exhaustion | v6 + translation at edge |
| App readiness unknown | Dual-stack discovery first |
| OT frozen vendors | Isolate IPv4 islands |
| Cloud dual-stack | Match cloud VPCs/VNets |

## Real-world — university campus

**Brief:** Students bring v6-capable devices; research partners require v6; dorm NAT is painful; some lab instruments IPv4-only.

| R / C / A | Statement |
|---|---|
| R | Campus services reachable on v6 within 1 year; labs keep working |
| C | Limited staff hours; instruments cannot upgrade |
| A | “NAT64 for the whole campus replaces dual-stack” — risky |

**Decision:** Dual-stack campus IT; NAT64 only for specific v6-only Wi-Fi experiments; keep lab VRF IPv4. Reject big-bang single-stack.

## Program phases

1. Inventory apps and address overlaps.
2. Design v6 hierarchy (not afterthought /64 chaos).
3. Dual-stack critical paths; measure.
4. Turn down unused v4 where safe.
5. Translation only with owners and monitoring.

## Risks

- Tunnel spaghetti.
- Broken ACL/FF parity between v4 and v6.
- Assuming “IPv6 later” while cloud already ships v6.

## Interview framing

“I pick transition tools from app readiness and risk—usually dual-stack with planned hierarchy, and translation only at deliberate edges.”

## Related

- [Dual-stack design](03_Dual_Stack_Design.md)
- [Addressing as architecture](01_Addressing_as_Architecture.md)
- [Summarizable address plans](04_Summarizable_Address_Plans.md)

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
