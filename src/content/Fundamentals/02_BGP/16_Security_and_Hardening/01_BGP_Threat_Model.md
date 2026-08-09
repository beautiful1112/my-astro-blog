# BGP Threat Model

BGP security failures fall into several classes. No single feature covers all of them—design **layered controls** around explicit trust boundaries (Internet eBGP, IX route-server, PE-CE, iBGP core).

## Threat classes

| Class | Example | Primary controls |
|---|---|---|
| Unauthorized session | Spoofed SYN to TCP 179 | iACL, GTSM, MD5/TCP-AO, CoPP |
| Session reset | Injected RST / MD5 brute | Auth, GTSM, ACL |
| False origination | Hijack more-specific | RPKI/ROV, IRR filters, prefix lists |
| Attribute manipulation | Altered AS_PATH / communities | Prefer trusted peers, roles/OTC, scrubbing |
| Route leaks | Peer routes to peer | Export policy, OTC, max-prefix |
| Resource exhaustion | Full table + churn | Max-prefix, CoPP, dampening |
| Control-plane DoS | Flood to RP | CoPP, ACL, separate management |
| Supply-chain / ops | Bad automation, IRR compromise | Change control, monitoring |

## Trust boundaries

```text
Internet eBGP  — least trust; strict filters + RPKI
IX / RS        — moderated trust; RS-specific policy
Customer PE-CE — contractual trust; prefix limits + SoO tools
iBGP / RR      — high trust; still authenticate + protect TCP
```

## Layered control map

| Layer | Mechanisms |
|---|---|
| Transport | ACL to peer IPs, GTSM, MD5/TCP-AO |
| Session | Max-prefix, passive, TTL |
| Path content | Prefix/AS-path filters, first-AS, RPKI, OTC |
| Action | RTBH / FlowSpec for response |
| Observe | BMP, looking glasses, RIB diff alerts |

## What each control does *not* do

- TCP-AO ≠ prefix ownership validation.
- RPKI origin validation ≠ path or leak proof.
- Max-prefix ≠ semantic correctness of the 500k accepted routes.
- GTSM ≠ encryption of UPDATE contents.

## Operational practice

- Document peer type and expected policy per session.
- Alert on unexpected origin AS, sudden prefix count, or OTC violations.
- Table-top hijack and leak scenarios quarterly.

## Interview framing

“BGP threats span session hijack, origin fraud, attribute tampering, leaks, and resource DoS—defend in layers because RPKI, TCP-AO, and prefix filters each cover different classes.”

## Example attack chains

1. **Hijack:** Attacker originates your /24 → without ROV peers accept Invalid/NotFound → traffic diverts. Mitigation: ROV drop Invalid + IRR filters + monitoring.
2. **Leak:** Peer exports full table to another peer → congestion. Mitigation: OTC + peer-type export + max-prefix.
3. **Session reset:** Off-path RST noise. Mitigation: GTSM + TCP-AO + iACL.

## Minimum baseline for Internet eBGP

- Peer ACL + GTSM + MD5/TCP-AO
- Prefix/AS-path filters + first-AS (non-RS)
- Max-prefix per family
- ROV enforce Invalid
- Roles/OTC where supported
- BMP / alerting on pfx count and origin changes

---
