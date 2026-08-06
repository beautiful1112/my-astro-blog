# Route-Target Import and Export

When a PE exports a VRF route, it attaches one or more route-target extended communities. A receiving VRF imports the VPN route if policy matches an import RT.

This enables:

- Full-mesh intranet VPNs.
- Hub-and-spoke VPNs.
- Shared-services access.
- Controlled extranet route leaking.

RT policy is directional: export membership and import membership need not be symmetric.

A missing route can exist in VPNv4 BGP yet be absent from a VRF because the RT did not match. Check VPN RIB, attached RTs, VRF import policy, and next-hop/label resolution separately.

---

