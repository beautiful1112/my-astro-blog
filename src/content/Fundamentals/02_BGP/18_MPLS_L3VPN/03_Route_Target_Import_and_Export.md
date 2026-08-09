# Route-Target Import and Export

**Route Targets (RTs)** are BGP **extended communities** that express VPN membership. A PE **exports** routes with one or more RTs and **imports** routes whose RTs match the VRF’s import list.

## Mechanism

```text
VRF CUST on PE-A:
  export RT 65000:100
  import RT 65000:100

PE-A attaches RT 65000:100 on VPNv4 advertisement
PE-B VRF with import 65000:100 installs the route
PE-C VRF without that import ignores it (may still receive if no RTC)
```

## Topology patterns

| Design | Export / Import pattern |
|---|---|
| Any-to-any | Same RT imported and exported everywhere |
| Hub-and-spoke | Spokes export Spoke-RT, import Hub-RT; hub imports Spoke-RT, exports Hub-RT |
| Central services | Extra RT for shared services VRF |
| Extranet | Selective mutual RT imports between VRFs |

Hub-and-spoke without careful RT design creates spoke-spoke paths via hub only—or accidental full mesh if mis-imported.

## Configuration

### Cisco

```text
vrf definition SPOKE
 rd 65000:11
 route-target export 65000:11
 route-target import 65000:100
vrf definition HUB
 rd 65000:100
 route-target export 65000:100
 route-target import 65000:11
 route-target import 65000:12
```

### Junos

```text
set routing-instances SPOKE vrf-target export target:65000:11
set routing-instances SPOKE vrf-target import target:65000:100
set routing-instances HUB vrf-target target:65000:100
set routing-instances HUB vrf-import HUB-IMPORT-POLICY
```

## Policy-based RT

RTs can be set/matched in route-maps / policy-statements for extranets, QoS coloring, or per-prefix membership—more flexible than static VRF lists alone.

## Interactions

| Mechanism | Relationship |
|---|---|
| **RD** | Uniqueness only |
| **RTC** | Constrains which RT-bearing routes an RR sends you—[06](06_Route_Target_Constraint.md) |
| **Inter-VRF leak** | Often implemented via RT import—[05](05_Inter_VRF_Leaking.md) |
| **SoO** | Independent site loop tool |
| **EVPN** | Also uses Route Targets for EVIs |

## Verification

```text
show bgp vpnv4 unicast vrf CUST 10.1.0.0
! Extended Community: RT:65000:100
show ip vrf detail CUST
! interfaces, RD, RT lists
```

## Risks

- Importing too many RTs creates unintended extranets.
- Hub-and-spoke RT mistakes either blackhole spoke-spoke or fully mesh them.
- Forgetting `send-community extended` on VPNv4 sessions drops RTs.

## Interview framing

“Route Targets are extended communities that drive VRF import/export membership; RDs uniquify NLRI, RTs decide who installs the route.”

---
