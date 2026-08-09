# Import vs Export Policy

**Import policy** decides what a neighbor may install locally and how accepted routes are classified. **Export policy** decides what you advertise to that neighbor and how advertisements are transformed.

A session becoming Established must **not** automatically authorize full route exchange—especially on eBGP ([RFC 8212 default reject](04_Default_Reject_RFC8212.md)).

## Typical import actions

| Action | Examples |
|---|---|
| Filter | Prefix, AS-path, max-prefix, RPKI Invalid reject |
| Classify | Set source communities / large communities |
| Prefer | LOCAL_PREF, weight |
| Validate | Origin ASN vs expected customer, IRR objects |
| Bound | Maximum-prefix warning/shutdown |

## Typical export actions

| Action | Examples |
|---|---|
| Authorize | Only local + customer (valley-free matrix) |
| Transform | Prepend, MED, communities |
| Scope | NO_EXPORT, unicast vs multicast AF |
| Aggregate | Summarize / suppress specifics |
| Safety | Strip internal communities; block peer→peer transit |

## Direction mental model

```text
Adj-RIB-In  --import-->  Loc-RIB / decision  --export-->  Adj-RIB-Out
```

Soft-reconfiguration, route-refresh, and BMP help inspect pre- and post-policy views ([Eligibility](../10_Best_Path/01_Eligibility_Before_Selection.md)).

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 192.0.2.1 remote-as 64496
 neighbor 192.0.2.1 route-map FROM-TRANSIT in
 neighbor 192.0.2.1 route-map TO-TRANSIT out
 neighbor 192.0.2.1 maximum-prefix 1000 90 restart 5
!
route-map FROM-TRANSIT deny 10
 match ip address prefix-list BOGONS
route-map FROM-TRANSIT permit 20
 set local-preference 100
 set community 65000:1300 additive
!
route-map TO-TRANSIT permit 10
 match ip address prefix-list OUR-AGGREGATES
 set as-path prepend 65000
```

### Junos

```text
set protocols bgp group TRANSIT import [ REJECT-BOGONS FROM-TRANSIT ]
set protocols bgp group TRANSIT export [ STRIP-INTERNAL TO-TRANSIT ]
set protocols bgp group TRANSIT family inet unicast prefix-limit maximum 1000
```

### FRRouting

```text
router bgp 65000
 neighbor 192.0.2.1 remote-as 64496
 address-family ipv4 unicast
  neighbor 192.0.2.1 route-map FROM-TRANSIT in
  neighbor 192.0.2.1 route-map TO-TRANSIT out
  neighbor 192.0.2.1 maximum-prefix 1000
 exit-address-family
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Communities | API between classify and act ([Community Design](../09_Communities/05_Community_Based_Policy_Design.md)) |
| Best-path | Only post-import eligible paths compete |
| ORF | Remote import hint; not a substitute for local export auth ([ORF](09_ORF.md)) |
| Conditional advertisement | Export gated on other prefixes ([Conditional Advertisement](10_Conditional_Advertisement.md)) |

## Verification

```text
show ip bgp neighbors 192.0.2.1 routes
show ip bgp neighbors 192.0.2.1 advertised-routes
show route receive-protocol bgp 192.0.2.1
show route advertising-protocol bgp 192.0.2.1
```

Change control: compute before/after accepted and advertised counts per AF (v4/v6).

## Risks

- Symmetric “same route-map in and out” without reading match direction.
- Export without valley-free rules → accidental transit ([Valley-Free](05_Valley_Free_Export.md)).
- Import that sets LP before bogon reject (order bugs).

## Interview framing

“Import controls what you accept and how you classify it; export controls what you announce and how you transform it; Established ≠ authorized.”

---
