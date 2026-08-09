# Maximum-Prefix and Resource Protection

Set **maximum-prefix** limits per peer and AFI/SAFI from expected route count, growth, and desired failure mode. A leaked full Internet table into a customer session is a classic outage without this backstop.

## Common actions

| Action | Behavior |
|---|---|
| Warning threshold | Log/SNMP only |
| Session teardown | Hard protect memory; traffic impact |
| Discard excess / idle | Keep session, drop new routes (platform-specific) |
| Restart timer | Auto-recover after delay |
| Manual recovery | Require operator clear |

Also monitor UPDATE rate, attribute size, path count (ADD-PATH), and memory. A peer can hurt you without crossing a simple prefix count.

## Sizing guidance

| Peer type | Order-of-magnitude expectation |
|---|---|
| Default-only | ~1–few routes; hundreds already suspicious |
| Customer partial | Agreed prefix inventory + headroom |
| IX bilateral | Peer’s announced set + growth |
| Transit full table | Current IPv4/IPv6 table + review cadence |

Re-audit limits when ADD-PATH multiplies paths or when tables grow.

## Configuration patterns

### Cisco

```text
router bgp 65000
 address-family ipv4
  neighbor 192.0.2.2 maximum-prefix 1000 80 restart 5
```

`80` = warning percent; `restart 5` = retry minutes (syntax varies).

### Junos

```text
set protocols bgp group CUST family inet unicast prefix-limit maximum 1000
set protocols bgp group CUST family inet unicast prefix-limit teardown 80
```

### FRR

```text
router bgp 65000
 address-family ipv4 unicast
  neighbor 192.0.2.2 maximum-prefix 1000
```

Apply **per family** (IPv4, IPv6, VPNv4, EVPN separately).

## Interactions

| Mechanism | Relationship |
|---|---|
| **Prefix filters** | Qualitative allow-list; max-prefix is quantitative |
| **ADD-PATH** | Path count may inflate toward limit |
| **CoPP** | Packet-rate protection vs RIB-scale protection |
| **ORF / RTC** | Reduce received set proactively |

## Verification

```text
show bgp neighbors 192.0.2.2
! Prefixes received / maximum
show bgp summary
! PfxRcd column vs limit
```

## Interview framing

“Maximum-prefix caps how many routes a peer may send per family so a leak or bug cannot exhaust RIB memory; size it from expected counts and monitor UPDATE rate too.”

---
