# Asymmetry and Data-Plane Failure

Control plane can show a valid best path while users experience loss or one-way connectivity.

## Diagnostic split

1. **Control plane OK?** Prefix best, NH resolved, FIB programmed.
2. **Forward path OK?** Traceroute/ping source→destination.
3. **Return path OK?** Reverse traceroute; uRPF; stateful firewall.
4. **MTU / PMTUD / label stack?** VPN/EVPN encapsulation surprises.

## Common BGP-adjacent causes

| Symptom | BGP-related angle |
|---|---|
| One-way loss | Inbound vs outbound policy diverge; asymmetry |
| Works to peer IP, fails to prefix | More-specific missing; aggregate discard |
| IXP session up, no data | Route-server NH; fabric issue ([case](../24_Practical_Cases/10_Route_Server_Up_Data_Plane_Down.md)) |
| Intermittent | ECMP polarization; flapping backup |

## Evidence

```text
show bgp ipv4 unicast <vip>
show ip cef <vip> detail
traceroute <vip> source <loopback>
# From far end: traceroute back to VIP
```

Do not “fix” asymmetry with blunt LP changes until both directions are measured. See [Asymmetric Routing](../22_Quant_Trading_Networks/04_Asymmetric_Routing.md).

## Minimum proof set

1. Loc-RIB best + FIB NH for VIP.
2. Forward traceroute.
3. Reverse traceroute or remote capture.
4. uRPF / firewall counters on both edges.

Only then adjust LOCAL_PREF or advertisements.

---
