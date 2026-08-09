# How to study BGP

BGP rewards layered study. Memorizing “higher LOCAL_PREF wins” without knowing *when* a path is eligible, or knowing the FSM without knowing RIB stages, produces interview answers that collapse under lab pressure. Study in four passes, then permanently keep a per-prefix checklist.

## Four passes

1. **Protocol mechanics:** TCP transport, FSM, messages, capabilities, RIBs, and core attributes. Goal: explain what the protocol *does* on the wire and in local tables. Start in [What BGP is](../02_Fundamentals/01_What_BGP_Is.md) and work through modules 03–07.
2. **Policy and selection:** import/export, communities, best-path ladder, and traffic engineering. Goal: predict which route is accepted, selected, installed, and advertised—four different outcomes. Later modules 08–11 deepen this.
3. **Scale and services:** route reflection, MP-BGP families, L3VPN, EVPN, FlowSpec, BGP-LS. Goal: reuse the same session/RIB model with new AFI/SAFIs instead of treating each service as a new protocol.
4. **Operations and interviews:** evidence-based troubleshooting, failure cases, and trade-offs (GR vs hard reset, soft-reconfig vs refresh, RPKI invalid actions). Goal: narrate diagnosis from logs and `show` output, not from guesswork.

Do not skip pass 1 to “get to cool features.” Most production BGP bugs are still session, next-hop, policy stage, or capability mismatches.

## Per-prefix checklist (always)

For every prefix under study or outage:

1. Was it received into Adj-RIB-In (pre- or post-policy, depending on platform)?
2. Did import policy leave it eligible, and did best-path put it in the Loc-RIB?
3. Was it installed in the global RIB/FIB (next-hop resolution, admin-distance competition, hardware programming)?
4. Was it permitted into each neighbor’s Adj-RIB-Out after export policy and iBGP split-horizon / RR rules?

Never treat “the BGP session is Established” as proof that useful routing is correct. An Established session can negotiate zero usable families, accept zero prefixes, or advertise blackhole next hops.

## Evidence habits

| Habit | Why it matters |
|---|---|
| Capture last-reset / NOTIFICATION before clearing | Clearing destroys the best clue |
| Compare configured vs negotiated capabilities | Family “enabled” locally ≠ active with peer |
| Separate control-plane best from FIB install | Loc-RIB winner can still be unusable |
| Trace one NLRI end-to-end | Full-table stares hide stage failures |
| Lab both failure and recovery | Backoff, GR, and refresh change timing |

## Suggested lab cadence

- Week mechanics: eBGP + iBGP loopback, collision/passive, Hold/Keepalive, soft-reconfig vs Route Refresh.
- Week policy: LOCAL_PREF / MED / prepend on the same topology; force next-hop unresolved then fixed.
- Week scale: RR path hiding vs ADD-PATH; one MP-BGP family (IPv6 or VPNv4) without reinventing the session story.
- Week ops: max-prefix, GTSM, RPKI invalid, graceful shutdown—watch what the peer *sees*.

Document every lab with the four checklist answers for one prefix. That notebook becomes interview ammunition.

## Cross-links to keep open

- [BGP learning objectives](02_Learning_Objectives.md)
- [Three conceptual RIBs](../07_RIBs_and_Updates/01_Three_Conceptual_RIBs.md)
- [Finite-state machine](../05_FSM_and_Timers/01_Finite_State_Machine.md)
- [Capability negotiation](../06_Messages_and_Capabilities/06_Capability_Negotiation.md)
- [Soft reconfiguration versus Route Refresh](../07_RIBs_and_Updates/05_Soft_Reconfiguration_vs_Refresh.md)

## Interview framing

“I study BGP as four questions per prefix—received, eligible/best, installed, advertised—and I never confuse an Established session with correct routing.”

---
