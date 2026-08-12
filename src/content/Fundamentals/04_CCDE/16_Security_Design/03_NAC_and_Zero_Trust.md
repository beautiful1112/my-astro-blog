# NAC and zero trust

**NAC** (802.1X/MAB/guest) answers “who is on my network” at the edge. **Zero trust / ZTNA** answers “no implicit trust from IP or location”—identity, device, path, continuously.

CCDE v3.1 calls out ZTNA, AI-assisted policy, migration from classic, AAA, guest/BYOD, IdP, certificates, EAP chaining, MFA.

Migration: monitor mode → low-impact → enforce. Big-bang 802.1X on a hospital is how you buy an availability incident.

Fail-open vs fail-closed when ISE/IdP is down is an **RTO vs security** decision—document it.

## Interview framing

“NAC is edge identity; zero trust is continuous, identity-centric access. I migrate in phases and I write what happens when the IdP is dead.”

---
