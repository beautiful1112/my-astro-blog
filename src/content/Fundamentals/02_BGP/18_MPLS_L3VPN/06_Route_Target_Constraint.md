# Route-Target Constraint

Route Target Constraint (RTC, RFC 4684) lets a BGP speaker advertise which route targets it needs. Other speakers can then avoid sending irrelevant VPN routes.

Benefits:

- Reduces VPN route state and update load.
- Speeds convergence when a PE participates in few VPNs.
- Limits unnecessary distribution.

RTC itself is another BGP address family with its own sessions and policy. A failure can make desired VPN routes disappear even though VPNv4 sessions are Established.

Troubleshoot the RT-membership advertisement before assuming the VPN route was never originated.

---

