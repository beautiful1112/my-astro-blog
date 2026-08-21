# VPN topologies

MPLS/EVPN VPN topology is **policy expressed with route targets (and related imports)**—not only a drawing of PE wires. Hub-spoke, any-to-any, and extranet are RT designs.

## Common topologies

| Topology | RT idea | Use |
|---|---|---|
| Any-to-any | Shared import/export | Full enterprise VPN |
| Hub-spoke | Spokes export to hub; spokes do not import each other | Central services / security |
| Partial mesh | Selective RT sets | Regions + central |
| Extranet | Controlled cross-import | Partner access |
| Management VPN | Separate RT | Out-of-band ops |

```text
Hub-spoke VPN:
  Spoke PE exports RT-Spoke
  Hub imports RT-Spoke, exports RT-Hub
  Spoke imports RT-Hub only  →  no spoke-spoke
```

## Underlay vs VPN topology

Physical mesh can still be **hub-spoke VPN**. Physical hub-spoke can still leak any-to-any if RTs are wrong. Always design both.

## Real-world — PCI retail + partner inventory

**Brief:** Stores should not talk store-to-store; HQ and regional hubs host POS; selected suppliers need read-only inventory extranet.

| R / C / A | Statement |
|---|---|
| R | No lateral store traffic; suppliers only to inventory VRF |
| C | Single MPLS provider; dual hub PEs |
| A | “ACLs on stores replace RT design” — incomplete |

**Decision:** Hub-spoke RT for stores; extranet RT for inventory only; central FW for supplier. Reject any-to-any “simpler RT.”

## EVPN parallel

EVPN uses RT/RD concepts for MAC/IP VRFs—same topology thinking applies to L2/L3 dual-homing designs.

## Checklist

1. Who may communicate?
2. Where is the security PEP?
3. Default route / Internet exit per VPN?
4. Hub redundancy (dual import/export)?
5. Route scale limits on spoke PEs?

## Risks

- Accidental spoke-spoke via wrong import.
- Hub as SPOF for routing and for firewalls.
- Overlapping IP without NAT plan in extranet.

## Interview framing

“VPN topology is an RT policy problem: I build hub-spoke or extranet from who-may-talk requirements, not from the physical circuit drawing alone.”

## Related

- [L3VPN versus L2VPN](02_L3VPN_vs_L2VPN.md)
- [EVPN as unified control](04_EVPN_as_Unified_Control.md)
- [Hub-spoke versus mesh](../06_Routing_Protocol_Selection/05_Hub_Spoke_vs_Mesh.md)

## Decision checklist

1. Which numbered requirement does this choice serve?
2. Which constraint forbids the popular alternative?
3. What failure domain did we shrink or accept?
4. What is the migration/rollback story?
5. How will ops prove it on a Tuesday night?
## Failure modes to narrate

| Fault | Bad design reaction | Good design reaction |
|---|---|---|
| Link/node loss | Timers only; no alternate | Diverse path + detect + repair |
| Control-plane churn | Flood detail everywhere | Summary/stub/level + bounded domain |
| Human change error | No canary / huge blast | Module seams + staged change |
| Dependency outage | Silent shared fate | Named fate-share + residual risk |
## What to discard

Discard slogan-driven picks (“modern,” “vendor preferred,” “more redundant”) that cannot cite R/C/A. Discard designs that cannot state what still works when one module fails.

## How you prove it

- Whiteboard the module borders and plane roles in <3 minutes
- Pull a link/node in a lab or maintenance window and compare to RTO
- Show the discarded option and the requirement that killed it

---
