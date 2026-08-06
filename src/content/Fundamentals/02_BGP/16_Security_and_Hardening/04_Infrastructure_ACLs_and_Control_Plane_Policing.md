# Infrastructure ACLs and Control-Plane Policing

Protect TCP port 179 so only configured peer addresses can reach the BGP process. Combine:

- Interface infrastructure ACLs.
- Control-plane policing.
- GTSM where appropriate.
- Session authentication.
- Management-plane isolation.

Policing must accommodate legitimate bursts: session establishment, route refresh, and reconvergence can generate substantial control traffic. An overly tight policer can cause Keepalive loss or slow convergence precisely during an incident.

Measure normal and failure traffic, then set class-specific thresholds with headroom.

---

