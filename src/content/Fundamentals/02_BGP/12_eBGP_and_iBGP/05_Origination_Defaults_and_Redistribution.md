# Route Origination, Defaults, and Redistribution

A BGP `network` statement typically requires an **exact matching route** in the local RIB before originating the prefix; it does not create the route by itself. Origination, default advertisement, and redistribution are the three ways prefixes enter BGP—and the three most common leak sources.

## Origination methods

| Method | Behavior | Risk |
|---|---|---|
| Network / exact originate | Advertises when exact RIB match exists | Missing RIB route → silent absence |
| Aggregation | Summary from components or static | Holes without discard |
| Redistribution | Injects from another protocol | Large unintended sets |
| Default-originate | Sends default to a neighbor | Promises to sink unknown traffic |

## Defaults

`default-originate` (or conditional default) creates a dependency: the receiver may send **all unknown traffic** to you. Tie the advertisement to real upstream reachability if blackholing during failure is unacceptable—see [Conditional Advertisement](../11_Policy_and_Traffic_Engineering/10_Conditional_Advertisement.md).

## Configuration patterns

### Cisco IOS / IOS XE

```text
ip route 203.0.113.0 255.255.255.0 Null0
!
router bgp 65000
 network 203.0.113.0 mask 255.255.255.0
 redistribute static route-map STATIC-TO-BGP
 neighbor 198.51.100.1 remote-as 65001
 neighbor 198.51.100.1 default-originate route-map DEF-IF-UPSTREAM
!
route-map STATIC-TO-BGP permit 10
 match ip address prefix-list ORIGINATE-ONLY
 set origin igp
 set community 65000:100
!
route-map DEF-IF-UPSTREAM permit 10
 match ip address prefix-list UPSTREAM-EXISTS
```

### Junos

```text
set routing-options static route 203.0.113.0/24 discard
set policy-options policy-statement ORIGINATE term 1 from route-filter 203.0.113.0/24 exact
set policy-options policy-statement ORIGINATE term 1 then accept
set protocols bgp group EDGE export ORIGINATE
set protocols bgp group CE export DEFAULT-COND
set policy-options policy-statement DEFAULT-COND term 1 from route-filter 0.0.0.0/0 exact
set policy-options policy-statement DEFAULT-COND term 1 then accept
```

### FRRouting

```text
ip route 203.0.113.0/24 blackhole
!
router bgp 65000
 address-family ipv4 unicast
  network 203.0.113.0/24
  redistribute static route-map STATIC-TO-BGP
  neighbor 198.51.100.1 default-originate
 exit-address-family
```

## Interactions

| Mechanism | Interaction |
|---|---|
| ORIGIN attribute | Redistribution often yields INCOMPLETE ([ORIGIN](../08_Path_Attributes/02_ORIGIN.md)) |
| RPKI | Originated aggregates/specifics must match ROAs |
| IGP redistrib | Tags prevent re-injection loops |
| Valley-free export | Only authorized originated/customer prefixes leave the AS |

## Verification

```text
show ip route 203.0.113.0 255.255.255.0
show ip bgp 203.0.113.0/24
show ip bgp neighbors 198.51.100.1 advertised-routes
! Confirm default presence/absence under upstream failure
```

## Risks

- Redistribute connected/OSPF into BGP on an edge without prefix-lists.
- default-originate always-on while upstream is down → customer blackhole.
- network statement for a /24 while only a /25 exists in RIB → no advertisement.
- Mutual redistribution creating durable loops.

## Interview framing

“network originates only with an exact RIB match; redistribution needs strict route-maps; default-originate is a reachability promise—condition it on real upstream state.”

---
