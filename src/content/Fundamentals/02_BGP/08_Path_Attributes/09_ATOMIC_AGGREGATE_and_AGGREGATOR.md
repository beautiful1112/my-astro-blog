# ATOMIC_AGGREGATE and AGGREGATOR

Aggregation can discard path detail from contributing more-specific routes. Two attributes document that fact and who formed the summary.

## ATOMIC_AGGREGATE

**ATOMIC_AGGREGATE** is a well-known discretionary attribute that warns receivers: the less-specific advertisement may have **lost AS_PATH or other information**, and they should **not deaggregate** the NLRI based on incomplete knowledge.

It is a warning flag (zero-length attribute), not a metric. Presence means “information was dropped during aggregation.”

## AGGREGATOR

**AGGREGATOR** is optional transitive and identifies the **ASN and router ID** (BGP Identifier) of the speaker that formed the aggregate. With four-octet ASNs, **AS4_AGGREGATOR** may appear toward legacy peers (see [Four-Octet ASN Path Handling](05_Four_Octet_AS_Path_Handling.md)).

## Modern operational pattern

Many networks do **not** rely on dynamic BGP aggregation of learned components. Instead they:

1. Install a static (or null/discard) route for the aggregate prefix.
2. Originate that prefix into BGP under explicit policy.
3. Optionally suppress or selectively advertise components.
4. Attach communities and carefully control AS_PATH (often AS_SEQUENCE of the local ASN only).

The discard route prevents a forwarding loop when traffic matches the summary but no component exists. See [Aggregation and Discard Routes](../11_Policy_and_Traffic_Engineering/07_Aggregation_and_Discard_Routes.md).

## Configuration patterns

### Cisco IOS / IOS XE

```text
ip route 192.0.2.0 255.255.255.0 Null0
!
router bgp 65000
 aggregate-address 192.0.2.0 255.255.255.0 summary-only as-set
 ! as-set / summary-only are design choices—document them
 network 192.0.2.0 mask 255.255.255.0
```

`summary-only` suppresses components; `as-set` can create AS_SET (counts as one hop, weakens validation). Prefer explicit static+network with policy in many SP designs.

### Junos

```text
set routing-options static route 192.0.2.0/24 discard
set policy-options policy-statement AGG term 1 from route-filter 192.0.2.0/24 exact
set policy-options policy-statement AGG term 1 then accept
set protocols bgp group EDGE export AGG
```

### FRRouting

```text
ip route 192.0.2.0/24 blackhole
!
router bgp 65000
 address-family ipv4 unicast
  network 192.0.2.0/24
  aggregate-address 192.0.2.0/24 summary-only
 exit-address-family
```

## Interactions

| Mechanism | Interaction |
|---|---|
| AS_PATH | AS_SET from aggregation complicates length and Aspath filters |
| RPKI | Aggregate origin ASN must match ROAs covering the summary (and maxLength policy) |
| More-specifics | Leaked or hijacked components still beat the aggregate in forwarding |
| ATOMIC_AGGREGATE | Signals loss of detail; receivers should not invent components |
| MED / communities | Often reset or selectively copied—platform-specific |

## Verification

```text
show ip bgp 192.0.2.0/24
! Atomic-aggregate / Aggregator fields when present
show ip route 192.0.2.0
! Confirm discard/null for the summary
traceroute 192.0.2.50
! Partial hole: control plane up, data plane blackhole expected
```

Test component failure: summary remains advertised while a covered destination is unreachable—that is often intentional, but must be understood.

## Risks

- Aggregating without a discard route → traffic follows default and loops.
- `as-set` leaking huge AS_SETs into the Internet.
- Attracting traffic for unallocated holes inside the summary.
- Assuming ATOMIC_AGGREGATE alone prevents deaggregation attacks—it does not; it is advisory.

## Interview framing

“ATOMIC_AGGREGATE warns that aggregation lost path information; AGGREGATOR names who built the summary; operationally, pair aggregates with discard routes and explicit policy.”

---
