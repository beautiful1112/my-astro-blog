# Standard Communities

A standard BGP community is a 32-bit optional transitive tag conventionally displayed as **ASN:value** (high 16 bits : low 16 bits). Communities let one policy attach meaning and another policy act on it without repeatedly matching large prefix or AS-path lists.

Communities do **nothing by themselves**. Effect comes entirely from import/export policy that matches and sets attributes (LOCAL_PREF, MED, accept/reject, prepend).

## Wire and display facts

- Attribute type code **8**, optional transitive.
- Multiple communities may appear in one path (community set).
- Export policy may delete, set, or additive-set communities at trust boundaries.
- Standard form cannot cleanly encode a four-octet ASN plus a rich local value—use [Large Communities](04_Large_Communities.md) for that.

Treat the community catalog as an **API**: document ownership, direction (in vs out), permitted senders, and action.

## Common uses

| Use | Example intent |
|---|---|
| Relationship class | Customer / peer / transit tags on import |
| Geography | Ingress PoP or region |
| Provider TE requests | “Set LP 200”, “prepend ×2 to peer X” per provider doc |
| Blackhole candidates | Combined with strict auth ([Well-Known](02_Well_Known_Communities.md), RFC 7999) |
| Audit / reason codes | Why a preference was applied |

## Configuration patterns

### Cisco IOS / IOS XE

```text
ip community-list standard CUST-ROUTES permit 65000:100
!
route-map FROM-CUST permit 10
 match community CUST-ROUTES
 set local-preference 300
 set community 65000:300 additive
!
route-map TO-TRANSIT permit 10
 set comm-list INTERNAL-ONLY delete
 set community 65000:50
!
router bgp 65000
 neighbor 198.51.100.1 route-map FROM-CUST in
 neighbor 192.0.2.1 route-map TO-TRANSIT out
```

### Junos

```text
set policy-options community CUST-ROUTES members 65000:100
set policy-options policy-statement FROM-CUST term 1 from community CUST-ROUTES
set policy-options policy-statement FROM-CUST term 1 then local-preference 300
set policy-options policy-statement FROM-CUST term 1 then community add MARK-CUST
set policy-options policy-statement FROM-CUST term 1 then accept
```

### FRRouting

```text
bgp community-list standard CUST-ROUTES permit 65000:100
route-map FROM-CUST permit 10
 match community CUST-ROUTES
 set local-preference 300
 set community 65000:300 additive
```

## Interactions

| Mechanism | Interaction |
|---|---|
| LOCAL_PREF / MED / prepend | Communities are usually the *signal*; attributes are the *action* |
| Well-known communities | Special numeric values with reserved meanings |
| Extended / Large | Parallel namespaces—do not assume one replaces another |
| RR / iBGP | Transitive tags propagate unless stripped |
| ORF / max-prefix | Orthogonal safety controls |

## Verification

```text
show ip bgp 192.0.2.0/24
show ip bgp community 65000:100
show bgp ipv4 unicast community 65000:100
show route community 65000:100 extensive
```

Confirm both **presence** of the tag and the **resulting** LOCAL_PREF / export decision.

## Risks

- Accepting action communities from unauthorized peers (LP or blackhole injection).
- Stripping provider communities before the provider can act.
- Undocumented overlapping `ASN:value` meanings across teams.
- Assuming transitive means “always exported”—policy can still delete.

## Interview framing

“Standard communities are optional transitive ASN:value tags whose only power is matching policy; treat the catalog as a documented API and strip or reject action tags at trust boundaries.”

---
