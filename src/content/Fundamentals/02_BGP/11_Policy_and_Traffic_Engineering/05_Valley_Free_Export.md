# Customer, Peer, and Provider Export Rules

A common commercial Internet model is **valley-free** export:

| Learned from | May export to |
|---|---|
| **Customer** | Customers, peers, and providers |
| **Peer** | Customers only |
| **Provider / transit** | Customers only |

This mirrors who pays whom and prevents free transit between peers or between providers. Import LOCAL_PREF commonly ranks **customer > peer > provider** ([LOCAL_PREF](../08_Path_Attributes/07_LOCAL_PREF.md)).

Real contracts include partial transit, paid peering, route servers, and regional exceptions. Encode the **actual** agreement, not only the textbook matrix.

## Implementation sketch

Tag routes on import with source class communities, then drive export from those tags ([Community Design](../09_Communities/05_Community_Based_Policy_Design.md)):

```text
Import peer   → community SRC-PEER   → LP 200
Import transit→ community SRC-TRANSIT→ LP 100
Import cust   → community SRC-CUST   → LP 300

Export to peer:    allow SRC-CUST (+ local)
Export to transit: allow SRC-CUST (+ local)
Export to cust:    allow SRC-CUST + SRC-PEER + SRC-TRANSIT (+ local)
```

## Configuration patterns

### Cisco IOS / IOS XE

```text
ip community-list standard SRC-CUST permit 65000:1100
ip community-list standard SRC-PEER permit 65000:1200
ip community-list standard SRC-TRANSIT permit 65000:1300
!
route-map TO-PEER permit 10
 match community SRC-CUST
 match ip address prefix-list OUR-AND-CUST
route-map TO-PEER deny 20
!
route-map TO-CUST permit 10
 match community SRC-CUST SRC-PEER SRC-TRANSIT
```

### Junos

```text
set policy-options community SRC-CUST members 65000:1100
set policy-options policy-statement TO-PEER term 1 from community SRC-CUST
set policy-options policy-statement TO-PEER term 1 then accept
set policy-options policy-statement TO-PEER term 2 then reject
```

### FRRouting

```text
bgp community-list standard SRC-CUST permit 65000:1100
route-map TO-PEER permit 10
 match community SRC-CUST
route-map TO-PEER deny 20
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Route leaks | Peer→peer or peer→provider export of non-customer routes |
| BGP Roles / OTC | Automated leak signal when supported |
| RPKI | Does not encode business relationship |
| Max-prefix | Limits damage but does not define valley-free rules |
| IX route servers | Still apply your export matrix toward RS and bilateral peers |

## Verification

```text
show ip bgp community 65000:1200
show ip bgp neighbors 192.0.2.1 advertised-routes
! Toward a peer, SRC-PEER and SRC-TRANSIT tagged paths must be absent
```

Leak drill: temporarily tag a transit-learned route as exportable to a peer in lab; confirm monitoring catches it; fix matrix.

## Risks

- “Full table to everyone” templates.
- Marking paid peering as customer accidentally.
- Stripping source communities before export policy runs.
- IPv6 matrix forgotten while IPv4 is correct.

## Interview framing

“Valley-free export sends customer routes everywhere but peer/provider routes only to customers; implement with import classification tags and an export matrix that matches the contract.”

---
