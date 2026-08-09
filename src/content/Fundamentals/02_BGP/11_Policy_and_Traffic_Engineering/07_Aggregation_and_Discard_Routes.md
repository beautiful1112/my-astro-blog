# Aggregation and Discard Routes

An aggregate reduces routing state by advertising a covering prefix. Operationally, pair the summary with a **discard/null** route so traffic that matches the aggregate but no component is **dropped locally** instead of following a default and looping.

## Why the discard route matters

```text
Internet --> you announce 203.0.113.0/24
Component 203.0.113.0/25 withdrawn (failure)
Without discard: packet matches aggregate attraction, then default → loop/blackhole far away
With discard: packet hits Null0/discard → contained failure
```

## Design choices

| Choice | Tradeoff |
|---|---|
| Always advertise aggregate vs require contributor | Stability vs accuracy |
| `summary-only` vs advertise components | Scale vs TE granularity |
| AS_SET vs plain local AS_PATH | Information vs leak/length quirks |
| ATOMIC_AGGREGATE / AGGREGATOR | Honesty about lost detail ([Attributes](../08_Path_Attributes/09_ATOMIC_AGGREGATE_and_AGGREGATOR.md)) |

## Configuration patterns

### Cisco IOS / IOS XE

```text
ip route 203.0.113.0 255.255.255.0 Null0
!
router bgp 65000
 network 203.0.113.0 mask 255.255.255.0
 ! or:
 aggregate-address 203.0.113.0 255.255.255.0 summary-only
```

Prefer static discard + `network`/`originate` policy in many SP designs for predictable attributes.

### Junos

```text
set routing-options static route 203.0.113.0/24 discard
set policy-options policy-statement ORIGINATE-AGG term 1 from route-filter 203.0.113.0/24 exact
set policy-options policy-statement ORIGINATE-AGG term 1 then accept
set protocols bgp group EDGE export ORIGINATE-AGG
```

### FRRouting

```text
ip route 203.0.113.0/24 blackhole
!
router bgp 65000
 address-family ipv4 unicast
  network 203.0.113.0/24
  aggregate-address 203.0.113.0/24 summary-only
 exit-address-family
```

## Interactions

| Mechanism | Interaction |
|---|---|
| More-specific TE | Components can still be announced selectively to some peers |
| RPKI | ROA must cover aggregate; maxLength must allow any advertised specifics |
| Conditional advertisement | Sometimes used instead of crude aggregates for backup |
| LONGEST match | Hijacked more-specifics still beat your aggregate worldwide |

## Verification

```text
show ip route 203.0.113.0 255.255.255.0
show ip bgp 203.0.113.0/24
traceroute 203.0.113.200
! With components down, expect discard—not a foreign default
```

Test partial failure explicitly: summary up, component down, measure user impact.

## Risks

- Aggregate without discard → looping during holes.
- Over-aggregating and hiding needed TE specifics.
- Attracting traffic for space you cannot actually serve.
- AS_SET aggregates polluting global AS_PATH analysis.

## Interview framing

“Originate aggregates with an explicit discard route so holes blackhole locally; decide summary-only vs components with RPKI maxLength and TE needs in mind.”

---
