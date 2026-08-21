# Case: DC stretch that shared fate

## Context

Enterprise with DC-A (primary) and DC-B (claimed active-active DR). Server team required “seamless vMotion and one subnet” for several clusters. Network delivered **stretched VLANs / VNIs** across DCI for almost all tenant LANs “to keep it simple.” Leaf-spine in each site; DCI was dark fiber with L2 extension service. Runbooks said “either DC can fail independently.”

## Incident

Change window in DC-A: a loop / broadcast storm from a mis-patched test VLAN leaked onto a stretched production VNI (permissive trunk allow-list). Storm and MAC instability traversed DCI into DC-B. Spines/leaves busy; east-west and north-south in **both** sites degraded. Stateful firewalls and LB health checks flapped. Declared SEV-1: “DR site unhealthy because of prod site.” ~3 hours to isolate stretch, prune VLANs, restore DC-B. Post-incident: RTO for independent DC operation was formally breached; auditors asked for redesign.

## R/C/A (reconstructed)

| ID | Type | Text |
|---|---|---|
| R1 | Req | Loss of one DC leaves the other serving critical apps within agreed RTO |
| R2 | Req | Named clusters may need constrained L2 (challenge per app) |
| R3 | Req | No multi-hour dual-DC outage from L2 fault |
| C1 | Constr | Some vendors still document L2 adjacency for cluster features |
| C2 | Constr | Existing ops skilled on L2 extend; L3 app change is political |
| C3 | Constr | DCI bandwidth finite; storm fills it |
| A1 | Assum (bad) | Stretch is required for all VMs |
| A2 | Assum (bad) | Dual-sided STP / storm control makes stretch “safe enough” for independence claim |
| A3 | Assum (bad) | Active-active marketing equals independent failure domains |

## Options considered

| Option | Description | Verdict |
|---|---|---|
| A | Default **L3 DCI**; anycast/DNS; isolate true L2 to one tightly controlled VNI with storm controls and no casual trunks | **Strategic — pick** |
| B | Dual-sided STP tuning / bigger DCI | Reject — still one flood domain |
| C | Keep full stretch; buy faster IRF/STP | Reject — treats symptom |
| D | Active/passive DC cold | Possible if R1 rewritten; different product |
| E | Immediate: prune stretch allow-list to mandatory clusters only; BPDU/storm controls | **Immediate** |

## What “good” looks like after

```text
DC-A leaf-spine                 DC-B leaf-spine
  tenant VRFs  <==== L3 DCI ====>  tenant VRFs
  anycast GW / DNS                 anycast GW / DNS

  VNI 9001 (cluster-X only) -- controlled stretch -- VNI 9001
       storm control, no user VNIs, explicit req ID
  VNI 100-500 app/user: NOT stretched

Independence claim applies to L3 tenants;
stretch carries written residual shared-fate risk
```

Process:

1. Inventory every stretched VLAN/VNI → requirement ID or delete.
2. Challenge “needs L2” with vendor SE and app owners; many clusters survive L3 with config.
3. Cage remaining stretch: dedicated VNI, policers, no transit of other VLANs on DCI.
4. Update BCP language: independence **or** stretch—not both for the same segment.

## Metrics / proof

| Test | Pass criteria |
|---|---|---|
| Induce storm in DC-A lab VNI | DC-B tenant VRF counters calm; only VNI 9001 may feel it |
| Kill DC-A border | DC-B serves L3 tenants within RTO |
| Trunk audit | No user VNI on DCI allow-list |
| App failover drill | DNS/anycast path proven without stretch |
| Doc | Residual risk signed for each remaining stretch |

## Interview one-liner

“If I stretch the VLAN, I will not claim independent DCs for that segment. R1 forces L3 DCI by default; stretch is a caged exception with a requirement ID and a signed residual risk.”

## CCDE takeaway

**Independence and stretch are opposites.** Buy L2 extend only for a named app, in a cage, with residual shared fate accepted in writing. Dual STP does not create two DCs. Default to L3 DCI and make stretch the exception with a requirement ID.

## Related

- [DCI patterns](../14_Data_Center_and_Cloud/03_DCI_Patterns.md)
- [L2 failure domains](../05_Layer2_Design/01_L2_Failure_Domains.md)
- [Fate sharing](../15_High_Availability_and_Scale/04_Fate_Sharing.md)
- [VXLAN EVPN DC](../14_Data_Center_and_Cloud/02_VXLAN_EVPN_DC.md)
- [Failure domains](../15_High_Availability_and_Scale/01_Failure_Domains.md)

---
