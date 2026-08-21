# QoS as a design problem

QoS is **who loses when the link is full**. If the link never congests, QoS is mostly marking hygiene. If it does, unmarked voice and backups will fight—and voice will lose without a deliberate scarcity policy.

```text
Apps → classify/mark (trust boundary) → PHB at congestion points → remark at domain edges
         DSCP/CoS                 queue / WRED / police / shape
```

QoS does not create bandwidth. It **allocates scarcity**. Sometimes the correct design is “buy a bigger pipe” when that is cheaper than a 12-class policy nobody understands.

## Design sequence

1. **Application classes and contracts** — loss / latency / jitter / bandwidth share
2. **Trust boundary** — usually access, wireless controller, SD-WAN LAN side, or DC leaf
3. **Marking** — DSCP (and CoS where needed) that survives the domain
4. **PHB** — queue, WRED, policing, shaping **where congestion actually is**
5. **Overlay** — inner vs outer markings (VPN, VXLAN, IPsec, SD-WAN)

## Class model (keep it small)

| Class (example) | Intent | Typical treatment |
|---|---|---|
| Real-time (voice/video interactive) | Low latency/jitter | Priority queue with **strict** admission/police |
| Critical business | Preferential bandwidth | CBWFQ / guaranteed share |
| Bulk / backup | Fill remaining | Scavenger or deep queue |
| Default | Everything else | Fair share; do not starve |

More than ~4–6 classes usually means the org cannot operate the policy. Complexity is a risk.

## Where to queue

| Location | Why |
|---|---|
| WAN / Internet edge | Classic congestion; shape to CIR |
| SD-WAN underlay/overlay | Per-tunnel and per-transport scarcity |
| DC uplink / spine | East-west bursts; AI/storage fabrics |
| Campus uplink | Wireless + wired aggregation |
| Do **not** only mark and hope | Marking without PHB is theater |

## Decision table — QoS vs capacity

| Situation | Prefer |
|---|---|
| Chronic saturation on expensive link | QoS + maybe redesign topology |
| Rare congestion, cheap upgrade | Buy bandwidth |
| Voice over thin branch links | Priority + admission; limit call count |
| Overlay VPN | Map inner DSCP ↔ outer; test under load |
| Multi-vendor path | Stick to well-known DSCP PHBs |

## Real-world — global voice + SaaS enterprise

**Facts:** Dual MPLS + Internet DIA, UCaaS, backups at night, branches 20–100 Mbps.

**Design:**

- 4 classes end-to-end; trust at access/phone
- EF-like treatment for voice with policed priority (not unlimited LLQ)
- Critical SaaS in AF; backup scavenger
- Shape to contracted rate on each WAN underlay; SD-WAN copies policy per transport
- Measure MOS / loss before and after—not just “policy pushed”

**Discarded:** 11-class SP template copied onto every branch switch with no congestion math.

## Real-world — trading / market-data adjacent LAN

**Facts:** Multicast feeds + order entry; loss intolerance on feeds; WAN not in path for hot path.

**Design:** Capacity first (non-blocking or stated oversubscription); QoS as **protection** against backup/sync storms, not as substitute for bandwidth. Isolate market-data VLAN/VRF; priority only where a shared uplink exists.

## Design checklist

1. Which apps lose first when the link is 100% full?
2. Where is the trust boundary—and what is untrusted?
3. Where does congestion actually occur under failure (not only happy path)?
4. Do overlays preserve or rewrite markings intentionally?
5. Can NOC explain the class model in one slide?

## Risks

- Unlimited priority queue starving everything (priority without police).
- Remarking wars between campus, WAN, and cloud.
- Assuming cloud SLA replaces enterprise QoS on the access path.
- Treating QoS as a substitute for fixing oversubscription ratios.

## Interview framing

“QoS is a scarcity policy with a trust boundary. I design a small set of classes from applications, mark once, and queue where congestion actually is—or I buy bandwidth when that is the better design.”

## Related

- [DiffServ end to end](04_DiffServ_End_to_End.md)
- [TCP, UDP, and QUIC implications](05_TCP_UDP_QUIC_Implications.md)
- [Multicast design choices](01_Multicast_Design_Choices.md)
- [SD-WAN design](../13_Campus_WAN_and_Edge/03_SD_WAN_Design.md)

---
