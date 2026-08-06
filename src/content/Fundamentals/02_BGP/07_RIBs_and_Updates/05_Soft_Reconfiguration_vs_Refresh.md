# Soft reconfiguration versus Route Refresh

Inbound soft reconfiguration stores an additional unmodified copy of received routes so new policy can be applied locally. It consumes substantial memory at Internet scale.

Route Refresh asks the peer to resend its export view and is normally preferred when negotiated. It consumes update/CPU bandwidth during refresh rather than permanent duplicate memory.

Before a policy change, know whether the platform can show true pre-policy routes, only accepted routes, or routes reconstructed through refresh.

---

