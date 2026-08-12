# VPN topologies

Route-targets implement **who can talk**, independent of the physical mesh.

| Topology | RT idea | Use |
|---|---|---|
| Any-to-any | Shared import/export | Full enterprise |
| Hub-spoke | Spokes export to hub; import only hub | Central inspection, no spoke-spoke |
| Extranet | Selective RT leak | Partner |
| Isolated | Unique RT, no leak | Strong tenancy |

Physical underlay can be full mesh while the **VPN** is hub-spoke (hairpin for security). That is often the point.

## Interview framing

“VPN topology is RT policy, not the optical mesh. I can force hub-spoke for inspection even if the underlay is any-to-any.”

---
