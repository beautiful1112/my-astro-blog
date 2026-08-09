# Per-Family Activation and Policy

BGP **TCP transport** and **address-family exchange** are separate layers. A neighbor can be Established while one AFI/SAFI has no routes for entirely local reasons. This is the root cause of “session is up but no VPNv4/IPv6/EVPN routes.”

## Independent failure modes

| Condition | Symptom |
|---|---|
| Family not activated under neighbor | Capability missing / zero prefixes |
| Capability negotiation failed | AF present locally, absent negotiated |
| No import policy / reject-all | Received counter may stay 0 or routes not accepted |
| No export policy / empty advertise set | Peer sees no prefixes from you |
| Family-specific max-prefix | Only that AF shut or throttled |
| Wrong next-hop format / unresolved NH | Routes in Adj-RIB-In, not installed |
| RT mismatch (VPN/EVPN) | Routes received globally, not in VRF |
| ORF / RTC filtering | Peer intentionally withholds NLRIs |

## Operational read-out order

For **each** family:

1. Negotiated capability / AF state.
2. Received prefixes.
3. Accepted / best / installed.
4. Advertised prefixes.
5. Family-specific notifications or dampening.

Do not stop at `show bgp summary` Established state.

## Configuration patterns

### Cisco — activate per AF

```text
router bgp 65000
 neighbor 192.0.2.2 remote-as 65000
 address-family ipv4
  neighbor 192.0.2.2 activate
 exit-address-family
 address-family vpnv4
  neighbor 192.0.2.2 activate
  neighbor 192.0.2.2 route-map VPN-OUT out
 exit-address-family
 address-family l2vpn evpn
  neighbor 192.0.2.2 activate
 exit-address-family
```

### Junos — family list on group

```text
set protocols bgp group CORE family inet unicast
set protocols bgp group CORE family inet-vpn unicast
set protocols bgp group CORE family evpn signaling
set protocols bgp group CORE export DEFAULT-REJECT
```

Default-reject plus explicit export per family prevents accidental leaks across contexts.

## Policy separation rules

- Keep IPv4, IPv6, VPNv4, EVPN, FlowSpec policies in **named, separate** statements.
- Set **per-family maximum-prefix**.
- On RRs, enable ADD-PATH / RR-client **per family**.
- Extended communities must be sent for VPN/EVPN (`send-community extended`).

## Verification

```text
show bgp neighbors 192.0.2.2
show bgp vpnv4 unicast neighbors 192.0.2.2 routes
show bgp vpnv4 unicast neighbors 192.0.2.2 advertised-routes
show bgp l2vpn evpn summary
```

FRR: `show bgp neighbors …` plus `show bgp <afi> <safi> summary`.

## Interactions

| Mechanism | Note |
|---|---|
| **Route refresh / soft reconfig** | Often issued per family |
| **Graceful restart** | Helper/preserved state can be per AF |
| **BMP** | Observability should export per-family RIBs |
| **Security filters** | Infrastructure ACLs allow TCP 179; they do not activate AFs |

## Interview framing

“Established only means TCP and OPEN succeeded; each AFI/SAFI still needs capability match, activation, policy, and next-hop/RT validity—debug families independently.”

---
