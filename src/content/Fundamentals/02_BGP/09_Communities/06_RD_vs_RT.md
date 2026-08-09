# Route Distinguisher vs Route Target

RD and RT solve different VPN problems. Confusing them causes “routes present in VPNv4 but missing in the VRF” tickets and false assumptions about path diversity.

## Comparison

| Item | Route Distinguisher (RD) | Route Target (RT) |
|---|---|---|
| Purpose | Makes an overlapping prefix **globally unique** in VPN NLRI | Controls VRF **import/export membership** |
| Location | Part of the VPN NLRI (e.g. VPNv4) | Extended community on the path |
| Policy role | No inherent import policy | Explicit membership / policy signal |
| Typical notation | `65000:10` or `192.0.2.1:10` | `target:65000:10` |

The RD creates distinct VPN routes such as two versions of `10.0.0.0/8`. The RT decides which VRFs **import** each version.

Using the same displayed number for RD and RT is an operational convenience, **not** a protocol requirement. A route has one RD (in the NLRI) and may carry **multiple** RTs.

## How they work together

```text
CE prefix 10.1.0.0/16
   → PE redistributes/learns into VRF
   → VPNv4 NLRI = RD:10.1.0.0/16
   → path attributes include RT export list
   → remote PE imports if VRF import RTs intersect
```

Changing the RD without changing RTs can still change BGP path identity and diversity (different NLRI). Changing RTs without changing RD changes membership only.

## Configuration patterns

### Cisco IOS / IOS XE

```text
vrf definition SITE-A
 rd 65000:1
 address-family ipv4
  route-target export 65000:100
  route-target import 65000:100
  route-target import 65000:999
 exit-address-family
```

### Junos

```text
set routing-instances SITE-A route-distinguisher 65000:1
set routing-instances SITE-A vrf-target export target:65000:100
set routing-instances SITE-A vrf-target import target:65000:100
set routing-instances SITE-A vrf-target import target:65000:999
```

### FRRouting

```text
vrf SITE-A
 vni 100
 exit-vrf
!
router bgp 65000 vrf SITE-A
 address-family ipv4 unicast
  rd 65000:1
  route-target export 65000:100
  route-target import 65000:100
 exit-address-family
```

## Interactions

| Mechanism | Interaction |
|---|---|
| SoO | Extended community loop control; orthogonal to RD |
| Unique RD per VRF / per PE | Improves multipath / add-path diversity options |
| Hub-spoke RT designs | Spoke export hub RT only; hub imports spoke RTs |
| allowas-in / as-override | PE-CE AS tools; RT/SoO still define VPN topology |

## Verification

```text
show bgp vpnv4 unicast all 10.1.0.0/16
! Note RD in NLRI and RT extended communities
show ip route vrf SITE-A 10.1.0.0
show route table SITE-A.inet.0 extensive
```

Debug checklist: VPNv4 best path present → RTs on path → local VRF import list → VRF RIB → CE advertisement.

## Risks

- Same RD on unrelated VRFs colliding in the global VPNv4 table.
- Importing `target:65000:100` into every VRF “for convenience.”
- Assuming RD change is required to steer traffic (usually LOCAL_PREF/MED/IGP/next-hop).
- Forgetting `send-community extended` so RTs never propagate.

## Interview framing

“RD uniquifies VPN NLRI; RT is an extended community that controls which VRFs import the route—they are independent even when the numbers match.”

---
