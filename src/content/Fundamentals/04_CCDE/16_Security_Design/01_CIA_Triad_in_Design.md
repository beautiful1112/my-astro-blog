# CIA triad in design

| Goal | Network translation |
|---|---|
| **Confidentiality** | Encryption, segmentation, who can decrypt, DLP egress |
| **Integrity** | Routing auth, RPKI, image/config integrity, telemetry authenticity |
| **Availability** | HA, DDoS, fail-open vs fail-closed, change safety |

Every security control **spends** one of the three. Fail-closed NAC raises confidentiality/integrity and can hurt availability (RTO for “new hire cannot work”). Write the trade-off.

## Interview framing

“I map every security control to C, I, or A, and I say which one I am spending when I fail-closed.”

---
