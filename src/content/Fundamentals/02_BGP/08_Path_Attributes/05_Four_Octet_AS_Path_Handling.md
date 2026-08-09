# Four-Octet ASN Path Handling

RFC 6793 extends ASNs from 16 bits to 32 bits (four-octet ASNs). Capable speakers use four-octet values directly in AS_PATH. When a new speaker peers with a **legacy two-octet-only** speaker, compatibility encoding preserves the real path while keeping the old format syntactically valid.

## Compatibility attributes

| Attribute | Role |
|---|---|
| **AS_PATH** (classic) | Toward legacy peers, real 32-bit ASNs may be replaced by **AS_TRANS (23456)** |
| **AS4_PATH** | Optional transitive attribute carrying the true four-octet path |
| **AS4_AGGREGATOR** | Same idea for AGGREGATOR when the aggregating ASN does not fit in 16 bits |

When a capable speaker receives both AS_PATH and AS4_PATH, it **reconstructs** the effective path per RFC 6793 merge rules. Operators should think in reconstructed path terms, not raw wire fragments.

## Operational symptoms

- Seeing **23456** in AS_PATH often means a legacy compatibility boundary, not that the neighbor’s real ASN is 23456.
- Filters that assume “all ASNs ≤ 65535” reject valid modern paths.
- Notation inconsistency: ASN `65551` may also be written `1.15` (dotted). Pick one house style and stick to it in policy and docs.
- Route servers / collectors may display reconstructed or raw forms differently—compare carefully when debugging.

Modern designs should support four-octet ASNs **end to end**. Compatibility attributes are for transition, not a preferred steady state.

## Configuration patterns

Most platforms enable four-octet support by default on current code. Explicit checks matter for old gear and for policies that encode ASN width assumptions.

### Cisco IOS / IOS XE

```text
router bgp 4200000000
 bgp router-id 192.0.2.1
 neighbor 192.0.2.2 remote-as 64496
 ! Ensure peer-groups/filters accept 32-bit ASNs
ip as-path access-list 10 permit ^4200000000_
```

### Junos

```text
set routing-options autonomous-system 4200000000
set protocols bgp group EDGE peer-as 64496
# as-path expressions use plain 32-bit integers
set policy-options as-path MY-ORIGIN "^4200000000.*"
```

### FRRouting

```text
router bgp 4200000000
 neighbor 192.0.2.2 remote-as 64496
!
bgp as-path access-list MY-ORIGIN permit ^4200000000_
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Prepending | Prepend the real 32-bit ASN; legacy peers may still show AS_TRANS in classic AS_PATH |
| Aggregator | Large aggregating ASN needs AS4_AGGREGATOR toward old speakers |
| Confederations | Member ASNs may also be four-octet; verify platform support |
| Communities | Standard `ASN:value` cannot cleanly encode large ASN + useful value—prefer [Large Communities](../09_Communities/04_Large_Communities.md) |
| RPKI ROAs | Origin ASN in ROA is 32-bit capable; ensure validators and routers agree on notation |

## Verification

```text
show bgp ipv4 unicast 192.0.2.0/24
! Inspect AS_PATH and, if shown, AS4_PATH / reconstructed path
show ip bgp neighbors 192.0.2.2
! Capability: Four-octet ASN Capability
```

Lab checks:

1. New–new peering: AS_PATH shows real large ASNs; no persistent 23456.
2. New–old peering: classic path may contain 23456; AS4_PATH present on capable side.
3. Regex filters written for 16-bit only: confirm they do not silently drop large origins.

## Risks

- Hard-coded 16-bit ASN fields in automation, IRR tools, or ACLs.
- Treating every 23456 as malicious rather than transitional.
- Mixing dotted and plain ASN forms in the same policy set until someone mismatches a ROA or filter.

## Interview framing

“RFC 6793 four-octet ASNs use AS_TRANS 23456 plus AS4_PATH toward legacy peers; capable speakers reconstruct the real path, and filters must not assume 16-bit ASNs.”

---
