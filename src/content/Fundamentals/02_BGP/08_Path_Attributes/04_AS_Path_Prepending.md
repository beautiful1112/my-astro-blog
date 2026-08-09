# AS-Path Prepending

AS-path prepending repeats an ASN during **export** so the advertisement appears longer and is therefore less attractive under the common “prefer shorter AS_PATH” rule. It is an **inbound-traffic hint** toward remote networks, not deterministic control of return paths.

## Mechanism

On export, policy prepends one or more copies of an ASN (usually the local ASN) onto AS_SEQUENCE **before** the peer receives the UPDATE. Receivers that still compare AS_PATH length after LOCAL_PREF will tend to prefer alternate, shorter paths when available.

Prepending does not change LOCAL_PREF inside remote ASes, does not override more-specific prefixes, and does not guarantee any particular transit AS will honor the hint.

## Why it fails as a sole TE tool

| Reality | Effect |
|---|---|
| Remote LOCAL_PREF | Customer/peer preference often beats any prepend length |
| More-specifics | A /24 still wins over a prepended /16 in forwarding |
| Unequal alternatives | Some upstreams see no alternate path—traffic stays |
| Ignore / cap policies | Some networks discount or ignore excessive prepends |
| Looking-glass lag | Local “advertised-routes” never proves Internet selection |

For cleaner regional or peer-specific engineering, prefer **provider-documented communities** over indiscriminate prepending. See [Community-Based Policy Design](../09_Communities/05_Community_Based_Policy_Design.md) and [Outbound vs Inbound TE](../11_Policy_and_Traffic_Engineering/06_Outbound_and_Inbound_Traffic_Engineering.md).

## Configuration patterns

### Cisco IOS / IOS XE

```text
route-map PREPEND-ISP-A permit 10
 match ip address prefix-list TE-PREFIXES
 set as-path prepend 65000 65000
route-map PREPEND-ISP-A permit 20

router bgp 65000
 neighbor 192.0.2.1 remote-as 64496
 neighbor 192.0.2.1 route-map PREPEND-ISP-A out
```

### Junos

```text
set policy-options policy-statement PREPEND-ISP-A term 1 from prefix-list TE-PREFIXES
set policy-options policy-statement PREPEND-ISP-A term 1 then as-path-prepend "65000 65000"
set policy-options policy-statement PREPEND-ISP-A term 1 then accept
set protocols bgp group ISP-A export PREPEND-ISP-A
```

### FRRouting

```text
route-map PREPEND-ISP-A permit 10
 match ip address prefix-list TE-PREFIXES
 set as-path prepend 65000 65000
!
router bgp 65000
 neighbor 192.0.2.1 route-map PREPEND-ISP-A out
```

Use **selective** prepends per prefix and neighbor. Document intended primary/backup and maximum prepend count.

## Interactions

| Mechanism | Interaction |
|---|---|
| LOCAL_PREF at remote | Can completely nullify prepend effect |
| MED | Orthogonal; MED influences adjacent AS entry choice |
| Four-octet ASN | Prepend real 32-bit ASN; legacy boundaries may show AS_TRANS |
| Multipath | Longer path may drop out of ECMP eligibility |
| RPKI | Prepending does not change origin ASN for ROA matching |

## Verification

1. Confirm advertised AS_PATH on the egress neighbor (`show ip bgp neighbors <addr> advertised-routes`).
2. Check an **external** looking glass / route collector for the remote view.
3. Fail the preferred upstream and measure whether traffic returns on the prepended path.
4. Keep prepend count minimal; re-test after each change.

```text
show ip bgp neighbors 192.0.2.1 advertised-routes
show bgp ipv4 unicast neighbors 192.0.2.1 advertised-routes
```

## Risks

- Triple+ prepends as a habit create brittle, hard-to-debug attraction patterns.
- Prepending someone else’s ASN (except rare coordinated designs) is hostile and filter-bait.
- Assuming “we prepended, so inbound moved” without external proof.
- Prepending during an outage can trap traffic on a dead alternate if the primary withdraws late.

## Interview framing

“Prepending lengthens AS_PATH to bias inbound selection; remote LOCAL_PREF and more-specifics still dominate, so verify from outside and prefer documented communities when available.”

---
