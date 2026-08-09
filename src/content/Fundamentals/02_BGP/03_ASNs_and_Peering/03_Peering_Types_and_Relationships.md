# Peering relationships

Operational **relationships** between ASes shape import/export policy more than any single BGP attribute. Incorrect relationship classification is a primary cause of **route leaks**: advertising a path to a neighbor that should never have received transit through you.

## Relationship classes

| Relationship | Typical business meaning | Usual export of learned routes |
|---|---|---|
| **Customer** | Pays local AS for transit | Customer routes → providers, peers, other customers |
| **Provider / transit** | Local AS pays for transit | Provider routes → **customers only** (not to other providers/peers) |
| **Settlement-free peer** | Exchange customer cones | Peer routes → **customers only** |
| **Private interconnect** | Bilateral physical/logical peering | Per contract; often peer-like or special TE |
| **Route server** (IX) | Fabric distributes member routes | Members receive others’ routes; RS often preserves member NEXT_HOP |

Valley-free intuition: traffic should not transit from provider→peer→provider through your AS. Encode that in policy, not in hope.

See [Path vector and policy](../02_Fundamentals/03_Path_Vector_and_Policy.md) and later policy modules for implementation patterns.

## Signaling relationships in BGP

Relationships are not a base RFC 4271 field. Operators encode them with:

- import/export policy sets per peer group;
- communities (standard/large) as a TE/relationship API;
- BGP roles / OTC (RFC 9234) where implemented, to help detect leaks;
- prefix filters and AS-path filters as hard bounds.

Document the community → LOCAL_PREF / export matrix as an internal API.

## Configuration patterns (relationship-shaped policy)

### Cisco IOS / IOS XE

```text
route-map FROM-CUST permit 10
 set local-preference 300
 set community 65000:300 additive
route-map TO-PEER permit 10
 match community 65000:300
! deny provider-learned toward peer by omission / explicit deny
route-map TO-PEER deny 20
!
router bgp 65000
 neighbor 198.51.100.1 remote-as 65001
 neighbor 198.51.100.1 route-map FROM-CUST in
 neighbor 192.0.2.1 remote-as 64496
 neighbor 192.0.2.1 route-map TO-PEER out
```

### Junos

```text
set policy-options policy-statement FROM-CUST term 1 then local-preference 300
set policy-options policy-statement FROM-CUST term 1 then community add CUST
set policy-options policy-statement TO-PEER term cust from community CUST
set policy-options policy-statement TO-PEER term cust then accept
set policy-options policy-statement TO-PEER term else then reject
set protocols bgp group CUST import FROM-CUST
set protocols bgp group PEERS export TO-PEER
```

### FRRouting

```text
route-map FROM-CUST permit 10
 set local-preference 300
 set community 65000:300 additive
route-map TO-PEER permit 10
 match community 65000:300
route-map TO-PEER deny 20
!
router bgp 65000
 neighbor 198.51.100.1 route-map FROM-CUST in
 neighbor 192.0.2.1 route-map TO-PEER out
```

## Interactions

| Mechanism | Interaction |
|---|---|
| LOCAL_PREF | Often ranked Customer > Peer > Provider for outbound exit |
| AS_PATH prepend | Inbound TE toward providers; does not replace export hygiene |
| Route servers | Easy to mis-model as “full transit mesh” |
| RPKI | Validates origin; does **not** encode customer/provider relationship |

## Verification

```text
show ip bgp neighbors 192.0.2.1 advertised-routes
show ip bgp community 65000:300
show route advertising-protocol bgp 192.0.2.1
```

Lab checks:

1. Learn ISP prefix; confirm it is **not** in Adj-RIB-Out toward a peer.
2. Learn customer prefix; confirm it **is** advertised to provider and peer.
3. Simulate a leak (permit all out); observe peer receiving provider routes.

## Risks

- Full-table export to a peer “temporarily” → becomes permanent transit abuse.
- Classifying a paid transit link as settlement-free → wrong LOCAL_PREF and export.
- Route-server sessions without IRR/RPKI filters → accepting junk at IX scale.

## Interview framing

“Peering relationships are business roles encoded in import/export policy: customer routes go everywhere appropriate; provider and peer routes go to customers only—misclassification causes route leaks.”

---
