# DCI patterns

Default datacenter interconnect is **L3**. L2 stretch (OTV, VXLAN stretch, dark-fiber VLANs, long vPC) is a **purchased shared fate**. CCDE answers that stretch first and ask questions later usually fail an “independent DC” requirement.

## Pattern menu

| Pattern | Use when | Residual risk |
|---|---|---|
| **L3 + DNS/GSLB / anycast** | Most apps | App must handle IP/DNS move |
| **L3 + sync replication** | Databases with their own HA | Link capacity for sync |
| **Backup-only DCI** | RTO hours OK | Cold reality — test restores |
| **Isolated L2 stretch** | Named cluster truly needs L2 | That segment’s dual-DC fate |
| **Active-active stretched user LAN** | Almost never | Company-wide L2 event |

```text
Good default:
DC-A fabric -- L3 DCI / dark IP -- DC-B fabric
   EVPN/VRF local          EVPN/VRF local
   DNS/GSLB/anycast points at healthy site

Exception cage:
   VNI 9001 only (cluster) with storm controls — not VNI 10-200
```

## Real-world — active-active stretch that failed

**Requirement (written):** “Either DC can run the business if the other fails.”

**Built:** Stretched VLANs for “seamless vMotion,” one STP/EVPN failure domain across metros, shared firewall pair mental model.

**Event:** Broadcast/control event in DC-A propagated to DC-B. Both sites sick. RTO for independence: **failed**.

**Repair:** Break stretch; L3 DCI; challenge vendors on L3 cluster modes; keep one isolated stretch for the single app that still needs it; update RTO docs.

## Real-world — retail DC pair done right

**Requirements:** Web tier active-active; DB primary/secondary; RPO minutes; no L2 between DCs.

**Design:** Leaf-spine + EVPN per site; L3 DCI; GSLB for web; DB native replication; FW policy duplicated (not one stretched HA pair across metros unless carefully designed).

## Real-world — finance DR “we only stretch one VLAN”

**Pitch:** Stretch a single VLAN for a legacy cluster “just for DR.”

**What happened:** That VLAN carried heartbeat **and** a shared management subnet for storage controllers. A storm/control storm on the stretch took both sites’ storage mgmt planes into flap. Trading apps on L3 survived; the “one VLAN” still violated independence for the tier-0 storage story.

**Lesson:** Isolated stretch must be **narrow in purpose and in fate**—heartbeat-only with hard storm bounds, or prefer vendor L3 HA. “One VLAN” is not automatically a small blast radius.

## Decision table — pick a DCI pattern

| App / requirement | Prefer | Avoid |
|---|---|---|
| Stateless web / API | L3 + GSLB/anycast | Stretched user VLAN |
| DB with native HA | L3 + sync/async per vendor | Stretching DB subnet for “VIP mobility” |
| Legacy cluster needs L2 | Named, isolated stretch + documented shared fate | Stretching whole tenant LAN |
| Regulatory “two independent sites” | Prove storm isolation | Any shared L2 domain |
| Migration weekend | Temporary stretch with kill date | Stretch left “temporary” for years |

## Decision test

Ask: “If I induce a storm in DC-A’s tenant LAN, do DC-B counters move?”  
- **Yes** → you do not have independent DCs.  
- **No** → L3 isolation is doing its job.

## Verification / proof

| Test | Pass criteria |
|---|---|
| Storm inject DC-A tenant LAN | DC-B fabric counters / CPU unchanged for that tenant |
| Pull DCI link | Each site keeps local east-west; north-south follows written failover |
| GSLB/anycast drill | Clients land on healthy site within RTO |
| Stretch exception (if any) | Only listed VNIs/VLANs on DCI; allow-list audited quarterly |
| Firewall story | No accidental L2 HA pair spanning metros unless designed and named |

## Risks

- Stretching “temporarily” for a migration and never removing it.
- One firewall cluster spanning both DCs on L2.
- Assuming cloud region pair is immune to the same mistake (wrong region peering / shared control).
- Treating “one VLAN only” as small blast radius when that VLAN carries storage or cluster mgmt.

## Ops checklist after choosing L3 DCI

1. Write independence RTO in the same doc as the DCI drawing.
2. Inventory every VLAN/VNI allowed on the interconnect (ideally none for user LAN).
3. Schedule kill dates for migration stretches; escalate if missed.
4. Duplicate FW/policy intent per site; avoid metro L2 HA pairs by default.

## Interview framing

“DCI is L3 unless the app proves it needs L2—and then that stretch is a named, isolated risk, not the whole tenant LAN.”

## Related

- [L2 failure domains](../05_Layer2_Design/01_L2_Failure_Domains.md)
- [VXLAN EVPN data center](02_VXLAN_EVPN_DC.md)
- [Case: DC stretch shared fate](../19_Practical_Cases/06_DC_Stretch_Shared_Fate.md)
- [Fate sharing](../15_High_Availability_and_Scale/04_Fate_Sharing.md)
- [DC multi-site and DCI](../../05_DC/09_Multi_Site_and_DCI/README.md)

---
