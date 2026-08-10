# Common Layer-2 multicast failures

Most “multicast is broken” tickets in access networks are snooping, querier, or scale problems—not PIM. Use this checklist before touching the core.

## Failure catalog

| # | Failure | Symptom | First check |
|---|---|---|---|
| 1 | No querier | Membership ages out; data stops after minutes | `show igmp snooping querier` |
| 2 | Mrouter port missing | Reports/data never reach LHR | mrouter table vs uplink |
| 3 | Fast leave on shared port | One Leave kills many receivers | leave policy + topology |
| 4 | Unknown-multicast drop | Early packets lost before join programmed | unknown flood/drop mode |
| 5 | MAC aliasing | Wrong channel on NIC / busy CPU | low-23-bit collisions |
| 6 | TCAM / replication exhaustion | Flood, punt, or admit failure | platform scale counters |
| 7 | STP / MLAG change | Stale ports, transient flood/loss | topology + relearn |
| 8 | VLAN mismatch | Report in VLAN A, data in VLAN B | VLAN / MVR design |
| 9 | IPv6 ND broken | Unicast IPv6 dies after MLD snooping | solicited-node groups |
| 10 | Storm control / CoPP | Control or data policed | drop ACL / storm counters |

Related: [Snooping terms](02_Snooping_Control_Terms.md), [L2 redundancy](10_L2_Redundancy_MLAG_Stack_and_Topology_Changes.md), [Symptom matrix](../15_Troubleshooting/04_Symptom_Matrix.md).

## Investigation order

1. Is there a querier (router or snooping querier)?
2. Is the uplink an mrouter port?
3. Does the group appear on the correct member ports?
4. Is unknown-multicast dropping first packets?
5. Any recent STP/MLAG/VLAN change?
6. Only then escalate to PIM/RPF.

## Configuration patterns (hardening sketch)

### Cisco-like

```text
ip igmp snooping
ip igmp snooping vlan 120
ip igmp snooping vlan 120 mrouter interface Port-channel10
! querier only if no L3 multicast router
ip igmp snooping querier
!
! avoid:
! ip igmp snooping vlan 120 immediate-leave   ! unless single-listener ports
```

### Junos

```text
set protocols igmp-snooping vlan FEED-VLAN
set protocols igmp-snooping vlan FEED-VLAN interface ae10.0 multicast-router-interface
```

### Validation ACL note

Do not filter `224.0.0.0/24` or `224.0.0.22` on access uplinks needed for Queries/Reports.

## Interactions

| Mechanism | Relationship |
|---|---|
| **MVR** | Cross-VLAN delivery mistakes look like “snooping bugs” |
| **PIM** | Healthy L3 cannot fix missing mrouter ports |
| **Host NIC filters** | Alias overload mimics L2 mis-delivery |
| **EVPN/VXLAN** | Overlay multicast state replaces classic flood |

## Verification

Walk one failing group:

```text
show ip igmp snooping querier
show ip igmp snooping mrouter
show ip igmp snooping groups vlan 120
show mac address-table multicast
show storm-control
```

Lab inject: shut querier → wait membership timeout → confirm symptom; restore querier → confirm recovery.

## Risks

- Fixing PIM RP while the access switch has no mrouter port.
- Enabling unknown drop to “clean the VLAN” without join-before-data discipline.
- Ignoring IPv6 when applying IPv4-centric storm controls.

## Interview framing

“L2 multicast fails from no querier, missing mrouter ports, fast leave on shared ports, unknown-drop, scale, or topology change—verify snooping state before debugging the RP.”

---
