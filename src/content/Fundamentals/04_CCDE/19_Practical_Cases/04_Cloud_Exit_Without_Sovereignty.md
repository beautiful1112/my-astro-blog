# Case: cloud exit without sovereignty

## Symptom

EU customer PII reached a US SaaS region via a “global” SD-WAN template. Legal stop-ship. Latency was actually fine.

## R/C/A

- R: GDPR residency for class PII
- C: SaaS vendor has EU region
- A: “cloud is anycast, location does not matter”

## Options

| A | Pin EU sites to EU region, DNS/CASB, block US destinations for that class |
| B | Encrypt more and hope |

**Pick A.** Encryption does not move the processing jurisdiction.

## Lesson

On-ramp and DNS are data-location controls. Fast and legal are different requirements.

---
