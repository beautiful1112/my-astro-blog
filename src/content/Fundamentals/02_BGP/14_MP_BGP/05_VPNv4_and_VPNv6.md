# VPNv4 and VPNv6 Address Families

VPNv4 (AFI 1 / SAFI 128) and VPNv6 (AFI 2 / SAFI 128) are the MP-BGP families that carry **MPLS L3VPN** (and similar VRF) routes between PEs. Customer prefixes never need to exist in the provider global table.

## NLRI contents

| Field | Purpose |
|---|---|
| **Route Distinguisher (RD)** | Makes the same customer prefix unique in the SP BGP table |
| **Customer prefix** | IPv4 or IPv6 NLRI |
| **Label** | VPN/service label the advertising PE expects |
| **NEXT_HOP** | Usually advertising PE loopback |
| **Route targets (extcommunity)** | Which VRFs import the route |

RD ≠ RT. RD uniquifies; RT controls membership. See [18_MPLS_L3VPN](../18_MPLS_L3VPN/README.md).

## Control-plane path

```text
CE --(PE-CE proto)-- PE VRF --export RT--> MP-BGP VPNv4/v6
        --> RR / other PEs --import RT--> remote PE VRF --> CE
```

Provider **P** routers need transport to PE next hops (IGP+LDP/SR/LU), not customer routes.

## Forwarding stack (typical MPLS)

```text
[ transport label(s) ][ VPN label ][ IP ]
```

All layers must align: VPN best path, RT import, next-hop resolution, transport LSP, VPN label, CE adjacency.

## Configuration patterns

### Cisco

```text
router bgp 65000
 address-family vpnv4
  neighbor 192.0.2.1 activate
  neighbor 192.0.2.1 send-community extended
  neighbor 192.0.2.1 route-reflector-client
 exit-address-family
 address-family ipv4 vrf CUST-A
  redistribute connected
 exit-address-family
```

### Junos

```text
set protocols bgp group RR family inet-vpn unicast
set protocols bgp group RR family inet6-vpn unicast
set routing-instances CUST-A instance-type vrf
set routing-instances CUST-A route-distinguisher 65000:10
set routing-instances CUST-A vrf-target target:65000:100
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **SoO / as-override / allowas-in** | PE-CE AS-loop toolkit—[08](../18_MPLS_L3VPN/08_PE_CE_AS_Loop_Toolkit.md) |
| **RTC** | Filters VPNv4 advertisements by RT interest—[06](../18_MPLS_L3VPN/06_Route_Target_Constraint.md) |
| **ADD-PATH** | Diversity for multihomed VRF prefixes |
| **Inter-AS Options A/B/C** | How VPNv4 is handed across AS boundaries |
| **EVPN Type-5** | Alternate L3 VPN signaling family |

## Verification

```text
show bgp vpnv4 unicast vrf CUST-A <prefix>
show ip route vrf CUST-A <prefix>
show mpls forwarding-table
ping vrf CUST-A <ce-address>
```

Same customer prefix can exist in many VPNs because different RDs make NLRIs distinct.

## Interview framing

“VPNv4/VPNv6 MP-BGP carries RD+prefix+label with RT communities so PEs import into the right VRFs; the core only needs transport to PE next hops, not customer routes.”

---
