# Default-Reject eBGP Policy (RFC 8212)

RFC 8212 requires an eBGP speaker using the Internet profile **not** to import or export routes until an **explicit policy** permits them. The goal is to eliminate the failure mode where a newly configured session immediately exchanges a full table or provides unintended transit before filters exist.

## Operational pattern

1. Build prefix, AS-path, community, and validation policy objects.  
2. Attach explicit **import** and **export** policy to the neighbor/group.  
3. Set conservative **maximum-prefix** limits.  
4. Bring up the neighbor.  
5. Verify accepted and advertised routes against intent (v4 and v6).  
6. Only then raise prefix limits or widen permits.

Treat default-reject as a **design requirement**, not an assumption—vendor defaults and legacy modes differ.

## Configuration patterns

### Cisco IOS / IOS XE

Modern IOS XE increasingly expects explicit policy; older “accept all” habits are dangerous.

```text
router bgp 65000
 neighbor 192.0.2.1 remote-as 64496
 address-family ipv4
  neighbor 192.0.2.1 route-map FROM-PEER in
  neighbor 192.0.2.1 route-map TO-PEER out
  neighbor 192.0.2.1 maximum-prefix 1200 90
 exit-address-family
!
route-map FROM-PEER deny 10
 match ip address prefix-list BOGONS
route-map FROM-PEER permit 20
 match ip address prefix-list DEFAULT-ONLY
!
route-map TO-PEER permit 10
 match ip address prefix-list OUR-SPACE
route-map TO-PEER deny 20
```

### Junos

Junos BGP export/import with default reject on eBGP when policy is configured properly:

```text
set protocols bgp group PEERS type external
set protocols bgp group PEERS import FROM-PEER
set protocols bgp group PEERS export TO-PEER
set policy-options policy-statement FROM-PEER term FINAL then reject
set policy-options policy-statement TO-PEER term FINAL then reject
```

### FRRouting

FRR historically could advertise/accept more than operators expect without policy—**always** attach route-maps:

```text
router bgp 65000
 neighbor 192.0.2.1 remote-as 64496
 address-family ipv4 unicast
  neighbor 192.0.2.1 route-map FROM-PEER in
  neighbor 192.0.2.1 route-map TO-PEER out
 exit-address-family
!
route-map FROM-PEER deny 100
route-map TO-PEER deny 100
```

Place final explicit deny terms so missing permits fail closed.

## Interactions

| Mechanism | Interaction |
|---|---|
| Max-prefix | Backstop if policy is too wide |
| Communities | Do not open export; still need NLRI permits |
| Route servers | IX LAN still needs your own export auth |
| iBGP | RFC 8212 focuses on eBGP Internet profile; still use explicit iBGP policy hygiene |

## Verification

```text
show ip bgp summary
show ip bgp neighbors 192.0.2.1
! Prefixes accepted / advertised should match lab plan—not “full table by surprise”
show ip bgp neighbors 192.0.2.1 routes | count
show ip bgp neighbors 192.0.2.1 advertised-routes | count
```

Negative test: configure neighbor with **no** permit terms → zero routes each way.

## Risks

- Cloning a production neighbor block and bringing it up before route-maps compile.
- AF activation (v6) without v6 policy.
- Assuming “template includes policy” when a peer-group inheritance broke.

## Interview framing

“RFC 8212 default-reject means eBGP exchanges nothing until explicit import/export policy permits it; operationalize with final deny terms, max-prefix, and before/after route counts.”

---
