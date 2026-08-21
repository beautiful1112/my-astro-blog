# NAC and zero trust

**NAC** (802.1X / MAB / guest portal) answers “who and what is on my edge” before or as they join. **Zero trust / ZTNA** answers “no implicit trust from IP or location”—access is identity-, device-, and continuously context-aware. CCDE cares about **planes, migration, and failure behavior**, not product logos.

## Compare the jobs

| Topic | Classic NAC | Zero trust / ZTNA |
|---|---|---|
| Primary question | Authenticate / authorize at edge | Authorize every session to apps |
| Trust of network location | Often high after auth | Low; path is not trust |
| Typical PEP | Switch / WLC / VPN concentrator | Broker / connector / SASE / IdP-aware proxy |
| Guest / BYOD | Portal, dACL, VLAN | Same identity story + app-scoped access |
| Failure of IdP | Fail-open vs fail-closed at edge | Same decision at broker |

CCDE v3.1 themes: ZTNA, AAA, guest/BYOD, IdP, certificates, EAP chaining, MFA, migration from classic, AI-assisted policy awareness.

```text
Device -- 802.1X/MAB --> Edge PEP -- RADIUS --> ISE/NAC
                              |
                         SGT / VLAN / ACL
User -- MFA/IdP --> ZTNA broker --> connector --> app
         continuous posture / device signal
```

## Real-world — hospital big-bang 802.1X

**Plan:** Flip enforce Friday night, all ports, all clinics.

**What happened:** Mis-profiled infusion pumps on MAB; critical care lost connectivity; rollback mid-incident; months of political damage to “security projects.”

**Better migration:**

1. **Monitor / low-impact** — learn endpoints, fix profiling.
2. **Selective enforce** — IT users, then clinical non-critical, then OT with exceptions list.
3. **Fail policy** written: IdP/ISE down → which VLANs fail-open, which stay closed.
4. Success metrics: auth success %, helpdesk tickets, clinical downtime zero.

## Real-world — bank ZTNA without edge story

**Wanted:** Replace VPN with ZTNA for contractors.

**Gap:** Contractors still sat on flat corp Wi-Fi with lateral reach after “ZTNA for apps.”

**Design:** ZTNA for app access **and** segmented corp access (guest-like or contractor VRF); no “ZTNA checkbox” that leaves Layer-2/3 trust intact on campus.

## Fail-open vs fail-closed

| Mode | When IdP/ISE dies | Fits | Risk |
|---|---|---|---|
| Fail-open | Limited access continues | Safety / clinical availability | Attacker window |
| Fail-closed | Deny new auth | High-security zones | Outage = security event |
| Hybrid | Guest/OT open rules differ from PCI | Most enterprises | Complexity; must document |

This is an **RTO vs security** decision—put it in R/C/A, not in tribal knowledge.

## Design checklist

1. Inventory authenticators: 802.1X, MAB, VPN cert, ZTNA device posture.
2. Name PEPs and the **one** policy store (or explicit sync).
3. Migration phases with rollback and numeric gates.
4. Guest/BYOD: internet and limited apps, not corp VLAN “for convenience.”
5. Certificates / EAP / MFA: operational ownership (who renews, who revokes).

## Risks

- Monitor mode forever (classification without enforcement).
- Fail-open everywhere “so we never break anything.”
- ZTNA for remote only while campus remains flat trust.
- MAB as permanent equal of 802.1X for high-risk devices.

## Interview framing

“NAC is edge identity; zero trust is continuous, identity-centric access. I migrate in phases and I write what happens when the IdP is dead—fail-open, fail-closed, or hybrid by zone.”

## Related

- [Segmentation](02_Segmentation.md)
- [Policy enforcement points](04_Policy_Enforcement_Points.md)
- [Regulatory and AI security](05_Regulatory_and_AI_Security.md)
- [RTO/RPO to HA mapping](../15_High_Availability_and_Scale/02_RTO_RPO_to_HA_Mapping.md)
- [User and application experience](../17_Automation_and_Observability/05_User_and_Application_Experience.md)

---
