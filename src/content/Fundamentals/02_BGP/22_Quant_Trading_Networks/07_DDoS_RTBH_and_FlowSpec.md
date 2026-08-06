# DDoS Response for Trading Services

A layered response can include:

- Provider diversion to scrubbing.
- Anycast absorption.
- RTBH for a specific attacked destination.
- FlowSpec for selective filtering or rate limits.
- Local ACL/policer changes.

Pre-authorize prefixes and communities, test the provider contract, and define who can trigger each action. Automate expiry and retain an audit trail.

For an order gateway, an incorrect mitigation may be as damaging as the attack. Use two-person approval or bounded automation for broad rules, and maintain an out-of-band control path.

---

