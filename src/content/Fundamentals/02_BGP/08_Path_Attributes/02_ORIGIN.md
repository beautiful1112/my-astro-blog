# ORIGIN

ORIGIN records how the prefix entered the **original** BGP speaker that introduced the NLRI into BGP. It is a well-known mandatory attribute (type code 1) with three values:

| Code | Display | Typical meaning |
|---:|---|---|
| 0 | IGP (`i`) | Injected with a network-style / IGP-originated mechanism |
| 1 | EGP (`e`) | Learned via the obsolete Exterior Gateway Protocol |
| 2 | INCOMPLETE (`?`) | Origin not determined—commonly redistribution |

ORIGIN does **not** mean the route is currently reachable through an IGP, nor that the prefix is trustworthy.

## Best-path placement

On most platforms, ORIGIN comparison occurs **after** LOCAL_PREF / weight and AS_PATH length, and **before** MED (exact ladder: [Vendor-Neutral Best-Path Model](../10_Best_Path/02_Vendor_Neutral_Selection_Model.md)):

1. Prefer IGP over EGP over INCOMPLETE.
2. Once one path wins on an earlier criterion, ORIGIN never compensates.

Because LOCAL_PREF and AS_PATH usually dominate, ORIGIN rarely decides Internet-edge selection—but it still matters in labs, redistribution-heavy campuses, and poorly designed TE.

## How ORIGIN gets set

| Injection method | Typical ORIGIN |
|---|---|
| `network` statement matching an exact RIB route | IGP |
| Aggregation of BGP components | Often inherits / depends on platform aggregate rules |
| Redistribute OSPF/IS-IS/static/connected into BGP | INCOMPLETE unless policy rewrites it |
| Explicit `set origin` in a route-map / policy | Whatever policy sets |

### Cisco IOS / IOS XE

```text
router bgp 65000
 network 192.0.2.0 mask 255.255.255.0
 redistribute static route-map STATIC-TO-BGP

route-map STATIC-TO-BGP permit 10
 match ip address prefix-list ORIGINATE
 set origin igp
 set community 65000:100
```

### Junos

```text
set policy-options policy-statement ORIGINATE term 1 from protocol static
set policy-options policy-statement ORIGINATE term 1 then origin igp
set policy-options policy-statement ORIGINATE term 1 then accept
set protocols bgp group EDGE export ORIGINATE
```

### FRRouting

```text
router bgp 65000
 address-family ipv4 unicast
  network 192.0.2.0/24
  redistribute static route-map SET-ORIGIN
 exit-address-family
!
route-map SET-ORIGIN permit 10
 set origin igp
```

## Interactions

| Feature | Interaction |
|---|---|
| Redistribution | Default INCOMPLETE is a fingerprint of “not network-statement” |
| Aggregation | Component ORIGIN values may be lost; see [ATOMIC_AGGREGATE](09_ATOMIC_AGGREGATE_and_AGGREGATOR.md) |
| Communities / LOCAL_PREF | Prefer these for TE; rewriting ORIGIN is opaque |
| RPKI | Origin **AS** validation is unrelated to the ORIGIN attribute name |

## Verification

```text
show ip bgp 192.0.2.0/24
! Origin codes: i = IGP, e = EGP, ? = incomplete
show bgp ipv4 unicast 192.0.2.0/24 bestpath
```

Lab checks:

1. Originate via `network` → expect `i`.
2. Redistribute without rewrite → expect `?`.
3. Two otherwise equal paths: `i` beats `?`.
4. Raise LOCAL_PREF on the `?` path → LOCAL_PREF still wins.

## Risks

- Using ORIGIN rewriting as primary TE is brittle and hard to audit.
- Operators confuse “ORIGIN = IGP” with “resolved by IGP next hop.”
- Silent redistribution can inject `?` routes that look second-class in selection until someone “fixes” ORIGIN and hides the real problem.

## Interview framing

“ORIGIN is mandatory and ranks IGP > EGP > incomplete after stronger policy knobs; incomplete usually means redistribution, and it is a weak traffic-engineering tool.”

---
