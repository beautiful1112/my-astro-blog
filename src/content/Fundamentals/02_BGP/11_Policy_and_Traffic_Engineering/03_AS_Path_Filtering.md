# AS-Path Filtering

AS-path policy enforces properties of the **AS_PATH attribute**, not the prefix. It is powerful for relationship checks and leak resistance, but it is **not cryptographic**—a peer can forge a plausible path.

## Common enforcement goals

| Goal | Example regex intent |
|---|---|
| Customer origin | Path begins with customer ASN |
| Neighbor check | eBGP path begins with peer’s ASN |
| Block transit leak | Deny paths that contain unexpected full-transit ASNs |
| Private ASN hygiene | Deny escaped private/reserved ASNs where inappropriate |
| Length bound | Cap AS_PATH length for sanity |
| Deny specific ASN | Drop paths containing a prohibited ASN |

Regex syntax and AS_SET / confederation representation vary by platform. Test every expression against explicit positive and negative examples; anchors (`^`, `$`, `_`) are easy to misuse.

## Configuration patterns

### Cisco IOS / IOS XE

```text
ip as-path access-list 10 permit ^65001_
ip as-path access-list 10 deny .*
ip as-path access-list 20 deny _64512_
ip as-path access-list 20 permit .*
!
route-map FROM-CUST permit 10
 match as-path 10
 match ip address prefix-list CUST-A
 set local-preference 300
```

### Junos

```text
set policy-options as-path CUST-ORIGIN "^65001 .*"
set policy-options as-path DENY-PRIVATE ".* 64512 .*"
set policy-options policy-statement FROM-CUST term 1 from as-path CUST-ORIGIN
set policy-options policy-statement FROM-CUST term 1 then accept
set policy-options policy-statement FROM-CUST term 2 then reject
```

### FRRouting

```text
bgp as-path access-list CUST-ORIGIN permit ^65001_
bgp as-path access-list CUST-ORIGIN deny .*
route-map FROM-CUST permit 10
 match as-path CUST-ORIGIN
 match ip address prefix-list CUST-A
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Prefix filters | Both required for customer auth |
| Prepending | Longer paths still match `^peer_` if peer is first |
| Four-octet ASN | Expressions must accept 32-bit ASNs ([Four-Octet](../08_Path_Attributes/05_Four_Octet_AS_Path_Handling.md)) |
| allowas-in | Own ASN may appear; adjust carefully |
| BGP Roles / OTC | Complementary leak prevention—not a regex replacement |
| RPKI / ASPA | Stronger origin/path validation layers when deployed |

## Verification

```text
show ip as-path-access-list 10
show ip bgp regexp ^65001_
show ip bgp neighbors 198.51.100.1 routes
```

Lab harness: feed paths `(65001)`, `(65001 64496)`, `(64496 65001)`, AS_SET forms, and AS_TRANS 23456; record allow/deny.

## Risks

- Unanchored `_65001_` matching mid-path and dropping valid transit.
- Copy-pasting Cisco regex into Junos (different engines).
- Assuming AS-path filters stop hijacks of **your** prefixes (origin + ROV matter).
- Over-permissive `permit .*` at the end undoing deny rules when order is wrong.

## Interview framing

“AS-path filters check relationship and shape of AS_PATH; combine with prefix and RPKI controls, test regexes against anchors and AS_SET, and never treat them as proof of legitimacy.”

---
