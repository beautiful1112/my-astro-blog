# Cisco-Style BGP Inspection Examples

IOS / IOS XE–style commands aligned to the eight-step inspection order. Exact syntax differs on IOS XR and NX-OS; prefer address-family–qualified forms on modern trains.

## Session and counters

```text
show bgp ipv4 unicast summary
show bgp ipv4 unicast neighbors 192.0.2.1
show bgp ipv4 unicast neighbors 192.0.2.1 | include prefixes|capabilities|Last reset|Notification
```

Confirm state Established, uptime, last reset, AFI activation, and received/accepted/advertised counts.

## Prefix views (received → advertised)

```text
show bgp ipv4 unicast neighbors 192.0.2.1 received-routes
! often requires soft-reconfiguration inbound
show bgp ipv4 unicast neighbors 192.0.2.1 routes
show bgp ipv4 unicast 203.0.113.0/24
show bgp ipv4 unicast neighbors 192.0.2.1 advertised-routes
```

**Semantics trap:** `received-routes` ≈ Adj-RIB-In pre-policy; `routes` ≈ post-import. Misreading these views causes false “best-path” diagnoses.

## RIB / FIB and attribute detail

```text
show ip route 203.0.113.0 255.255.255.0
show ip cef 203.0.113.1 detail
show bgp ipv4 unicast 203.0.113.0/24
```

Inspect LOCAL_PREF, AS_PATH, MED, AIGP, communities, next hop validity, and which path is best.

## Other families and VRF

```text
show bgp ipv6 unicast summary
show bgp vpnv4 unicast vrf CUST-A 10.1.0.0/16
show bgp vpnv4 unicast vrf CUST-A neighbors 192.0.2.10 advertised-routes
show bgp l2vpn evpn summary
```

For PE-CE loop toolkit symptoms, verify SoO extended communities and AS_PATH after `as-override`—see [PE-CE AS Loop Toolkit](../18_MPLS_L3VPN/08_PE_CE_AS_Loop_Toolkit.md) and [SoO](../18_MPLS_L3VPN/07_Site_of_Origin.md).

## Soft policy re-evaluation

```text
clear bgp ipv4 unicast 192.0.2.1 soft in
clear bgp ipv4 unicast 192.0.2.1 soft out
```

Prefer soft clear / route-refresh over hard reset when changing import/export maps.

## VIP watch one-liner set

```text
show bgp ipv4 unicast <vip>
show ip cef <vip> detail
show bgp ipv4 unicast neighbors <exchange> routes | include <vip>
show bgp ipv4 unicast neighbors <transit> advertised-routes | include <order>
```

Keep these in the runbook next to abort thresholds for latency/loss.

---
