# VRF-aware EIGRP

EIGRP can run in a **VRF** context (VRF-lite on CE/campus devices, or PE-CE style designs) so that routing tables, neighbors, and topologies stay isolated per VPN/customer. In **named mode**, this is expressed as address-family configuration **for a VRF** (and historically with EIGRP named topologies). Treat VRF-aware EIGRP as “same protocol, different RIB root,” not a new IGP.

## Mental model

```text
Global EIGRP AF ipv4 AS 100  ->  global RIB
VRF RED  EIGRP AF ipv4 AS 100  ->  VRF RED RIB
VRF BLUE EIGRP AF ipv4 AS 200  ->  VRF BLUE RIB
```

AS numbers may reuse across VRFs when domains never leak; uniqueness is about **adjacency domains**, not global Internet ASNs. Related: [AS number in EIGRP](01_AS_Number_in_EIGRP.md), [Classic versus named mode](02_Classic_vs_Named_Mode.md).

## Named mode + VRF (IOS XE pattern)

```text
vrf definition RED
 rd 65000:1
 address-family ipv4
 exit-address-family
!
router eigrp MULTI
 !
 address-family ipv4 unicast vrf RED autonomous-system 100
  network 10.1.0.0 0.0.255.255
  eigrp router-id 192.0.2.10
 exit-address-family
```

Interface must be in the VRF:

```text
interface GigabitEthernet0/0
 vrf forwarding RED
 ip address 10.1.1.1 255.255.255.0
```

## Classic / older notes

Classic VRF-aware EIGRP existed on various trains with `address-family ipv4 vrf …` under `router eigrp`. Prefer **named mode** for new VRF work—clearer AF boundaries and fewer legacy traps.

**Named topologies** (traffic-engineered EIGRP topologies beyond base) are an advanced Cisco feature; for fundamentals, know they exist as a multi-topology knob, not a daily campus requirement.

## PE-CE brief

Cisco PE may run EIGRP toward a CE VRF. Site-of-origin / redistribution into BGP VPNv4 is a **BGP/L3VPN** problem layered on top—do not confuse EIGRP stub with MPLS SoO. Interview: “EIGRP PE-CE is still EIGRP adjacency in a VRF; VPN isolation is RD/RT at BGP.”

Junos EIGRP VRF use is uncommon; FRR is not the primary teaching platform here.

## Verification

```text
show ip eigrp vrf RED neighbors
show ip route vrf RED eigrp
show eigrp address-family ipv4 vrf RED neighbors
show eigrp address-family ipv4 vrf RED topology
```

Lab checks:

1. Neighbor in VRF RED only; global table has no EIGRP route for that prefix.
2. Leak via BGP/redistribute deliberately; prove control of export.
3. Wrong VRF on interface → no neighbor despite correct AS.

## Risks

- Interface in wrong VRF → silent adjacency failure.
- Redistributing VRF EIGRP into global without filters → leak.
- Reusing RID across VRFs on one PE without documentation (ops confusion).

## Interview framing

“VRF-aware EIGRP isolates neighbors and topology per VRF RIB—named mode AF per VRF is the clean model; leaking is a redistribution/VPN policy problem, not an EIGRP AS magic.”

---
