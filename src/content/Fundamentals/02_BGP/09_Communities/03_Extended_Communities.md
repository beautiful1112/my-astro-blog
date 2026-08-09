# Extended Communities

Extended communities are **eight-octet** optional attributes with a typed structure. The type field distinguishes semantics and transitive vs non-transitive subclasses. They are the workhorse for VPN membership and many modern BGP applications.

## Structure (conceptual)

Formats include:

- **2-octet ASN : 4-octet value**
- **4-octet ASN : 2-octet value**
- **IPv4 address : 2-octet value**

Choose a format that can represent the administrator field you need (especially four-octet ASNs).

Attribute type code **16** (and related encodings for IPv6-specific extended communities where used). Transitivity depends on the type’s transitive bit—not all extended communities cross AS boundaries blindly.

## Major uses

| Application | Typical extended community role |
|---|---|
| MPLS L3VPN / EVPN | Route Targets (import/export membership) |
| Site-of-Origin | Loop prevention for multihomed VPN sites |
| FlowSpec | Traffic-action / redirect metadata |
| EVPN | Encapsulation, split-horizon, mobility / sequence metadata |
| Link bandwidth | Bandwidth hint for unequal-cost multipath ([Link Bandwidth Community](../11_Policy_and_Traffic_Engineering/11_Link_Bandwidth_Community.md)) |

An extended community is still a **policy attribute**. It is not automatically a VPN identifier unless the address family and VRF import/export policy interpret it that way. See [RD vs RT](06_RD_vs_RT.md).

## Configuration patterns

### Cisco IOS / IOS XE (VPN RT example)

```text
vrf definition CUSTOMER-A
 rd 65000:10
 address-family ipv4
  route-target export 65000:10
  route-target import 65000:10
 exit-address-family
!
router bgp 65000
 address-family vpnv4
  neighbor 10.0.0.2 send-community extended
 exit-address-family
```

### Junos

```text
set routing-instances CUSTOMER-A route-distinguisher 65000:10
set routing-instances CUSTOMER-A vrf-target target:65000:10
set protocols bgp group RR family inet-vpn unicast
```

### FRRouting

```text
router bgp 65000
 address-family ipv4 vpn
  neighbor 10.0.0.2 activate
  neighbor 10.0.0.2 send-community extended
 exit-address-family
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Standard / Large communities | Separate namespaces; policies often match all three |
| SoO vs allowas-in | SoO is preferred VPN loop control; see [allowas-in](../12_eBGP_and_iBGP/06_AllowAS_In.md) |
| RR | Must propagate extended communities for VPN correctness |
| Import RT filtering | Wrong RT → silent missing routes, not session failure |

## Verification

```text
show bgp vpnv4 unicast vrf CUSTOMER-A 10.10.10.0/24
show ip bgp vpnv4 all community
show route table CUSTOMER-A.inet.0 extensive
! Look for RT / SoO extended communities
```

## Risks

- Forgetting `send-community extended` → RTs never leave the PE.
- Reusing the same numeric value for RD and RT and then assuming they are coupled in the protocol (they are not).
- Transitive leakage of internal extended communities to the Internet.
- RT import explosions (one VRF importing overly broad targets).

## Interview framing

“Extended communities are typed 8-byte tags used heavily for RTs, SoO, and EVPN/FlowSpec metadata; they only enforce VPN membership when AF and VRF policy interpret them.”

---
