# Visibility, observability, and assurance

| Term | Meaning | Design question |
|---|---|---|
| **Visibility** | You can see counters and states | Are the right boxes exporting? |
| **Observability** | You can infer *why* from telemetry (logs, metrics, traces) | Can we debug the feared outage? |
| **Assurance** | Closed loop: intent vs actual, with alert/action | Do we detect drift before users do? |

A dashboard wallpaper is not assurance. Telemetry that dies with the outage you are debugging is not a design.

## Design the questions first

Pick the incidents you fear, then place sensors:

| Feared event | Signal | Where |
|---|---|---|
| Underlay brownout | Loss/latency/jitter SLA probes | Branch edge, hub, cloud on-ramp |
| Routing loop / flap | Prefix churn, CPU, drop | PE, RR, border |
| Silent packet drop | Flow + interface drops + synthetic | PEP seams |
| Controller push fail | Job status + device drift | Controller + canary device |
| Auth outage | RADIUS/IdP latency/error | Edge + IdP path |

```text
Intent (policy repo / controller)
        |
   Assurance compare -----> alert / ticket / auto-remediate (careful)
        |
   Telemetry: metrics + logs + flows + synthetics
        |
   Out-of-band path preferred when underlay is the patient
```

## Telemetry building blocks

| Tool | Strength | Caveat |
|---|---|---|
| SNMP / streaming telemetry | Device health, queue, optics | Volume; retention cost |
| NetFlow / IPFIX / sFlow | Who talks to whom | Samples; privacy |
| Syslog / audit | Change and auth events | Clock sync; noise |
| Packet capture at PEPs | Ground truth | Legal; storage; when to trigger |
| Synthetic probes | User-ish SLA | Probe path ≠ all user paths |

In-band vs out-of-band: if management shares the sick underlay, you go blind. Design a **management fate** that survives the production fault class you care about (LTE OOB, separate VRF, console concentrator).

## Real-world — “we have SolarWinds” during SD-WAN brownout

**Symptom:** Apps flap; NOC sees green because only ICMP to the edge IP on the working TLOC was polled.

**Repair:** Per-transport SLA probes, app synthetics (POS HTTPS, voice MOS path), alert on **brownout** not only hard down; underlay and overlay both instrumented.

## Real-world — assurance without authority

**Built:** Fancy intent-vs-state UI.

**Gap:** No owner, no runbook, alerts ignored; drift for months.

**Design:** Assurance is a **process**: severity, page route, freeze on drift class, link to rollback. Otherwise it is expensive wallpaper.

## Assurance loop (minimum viable)

1. Declare intent (ACL, VRF membership, tunnel SLA class).
2. Collect state (operational model, flows, probes).
3. Diff continuously.
4. Act: ticket, block pipeline promote, or controlled remediate.
5. Review false positives so the loop stays trusted.

## Risks

- Telemetry only in the failure domain that fails.
- Metrics without retention / cardinality budget (bill shock, drop).
- Capturing payloads without legal basis.
- Alert fatigue → ignored critical assurance.

## Interview framing

“I design telemetry to answer a question during the outage I fear. Assurance means I compare intent to state with an owner—not that I have a dashboard wallpaper. OOB must survive the patient underlay.”

## Related

- [CI/CD for the network](03_CI_CD_for_Network.md)
- [User and application experience](05_User_and_Application_Experience.md)
- [Controller-based design](01_Controller_Based_Design.md)
- [Policy enforcement points](../16_Security_Design/04_Policy_Enforcement_Points.md)
- [SD-WAN design](../13_Campus_WAN_and_Edge/03_SD_WAN_Design.md)

---
