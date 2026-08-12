# Visibility, observability, and assurance

| Term | Meaning |
|---|---|
| **Visibility** | You can see counters and states |
| **Observability** | You can infer *why* from telemetry (logs, metrics, traces) |
| **Assurance** | Closed loop: intent vs actual, with alerts/actions |

Design telemetry: what, from where, in-band vs out-of-band, volume, retention, and whether it survives the outage you are debugging.

NetFlow/IPFIX, streaming telemetry, packet capture at strategic PEPs, synthetic probes for SLA.

## Interview framing

“I design telemetry to answer a question during the outage I fear. Assurance means I compare intent to state, not that I have a dashboard wallpaper.”

---
