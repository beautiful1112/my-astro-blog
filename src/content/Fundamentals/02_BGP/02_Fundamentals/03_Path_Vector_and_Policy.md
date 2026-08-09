# Path vector and policy

Distance-vector protocols advertise a distance to a destination. Link-state protocols advertise topology and compute SPF. BGP advertises reachable **NLRI** plus a **vector of path attributes**. That design is why operators call BGP a path-vector protocol—and why policy can override “short” paths.

`AS_PATH` is central but not the only decision input. LOCAL_PREF expresses outbound exit preference inside an AS, MED can suggest an entry point to a neighboring AS, communities classify and signal intent, and import/export policy can accept, reject, or transform advertisements before or after selection.

## Path vector vs other models

| Model | What is advertised | Typical loop control | Policy role |
|---|---|---|---|
| Distance vector | Destination + metric | Split horizon / poison, etc. | Limited |
| Link state | Local topology LSAs/LSPs | SPF on shared topology view | Mostly within one admin domain |
| Path vector (BGP) | Destination + attribute vector including AS_PATH | AS_PATH loop detection across ASes | First-class: local and arbitrary |

The same UPDATE can be:

- accepted and preferred on one router;
- accepted but non-best on another;
- rejected entirely by a third.

That divergence is a **feature**: policy is local. Global consistency is neither assumed nor required.

## Where policy attaches

```text
Peer UPDATE
  -> Adj-RIB-In (pre-policy view if stored)
  -> import policy (accept / set attrs / reject)
  -> eligible paths + best-path decision
  -> Loc-RIB
  -> export policy (per neighbor / group)
  -> Adj-RIB-Out -> UPDATE to peer
```

Common levers (details in later modules):

- set LOCAL_PREF, MED, communities, NEXT_HOP;
- match prefix, AS_PATH, community, RPKI state, peer type;
- reject or prefer based on commercial relationship.

See [Three conceptual RIBs](../07_RIBs_and_Updates/01_Three_Conceptual_RIBs.md) and [Peering relationships](../03_ASNs_and_Peering/03_Peering_Types_and_Relationships.md).

## Configuration patterns

### Cisco IOS / IOS XE

```text
ip community-list standard PEER-ONLY permit 65000:200
!
route-map FROM-PEER permit 10
 match community PEER-ONLY
 set local-preference 200
route-map FROM-PEER deny 20
!
router bgp 65000
 neighbor 192.0.2.1 remote-as 64496
 neighbor 192.0.2.1 send-community
 neighbor 192.0.2.1 route-map FROM-PEER in
```

### Junos

```text
set policy-options community PEER-ONLY members 65000:200
set policy-options policy-statement FROM-PEER term peer from community PEER-ONLY
set policy-options policy-statement FROM-PEER term peer then local-preference 200
set policy-options policy-statement FROM-PEER term peer then accept
set policy-options policy-statement FROM-PEER term drop then reject
set protocols bgp group PEERS import FROM-PEER
```

### FRRouting

```text
bgp community-list standard PEER-ONLY permit 65000:200
!
route-map FROM-PEER permit 10
 match community PEER-ONLY
 set local-preference 200
route-map FROM-PEER deny 20
!
router bgp 65000
 neighbor 192.0.2.1 route-map FROM-PEER in
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Best-path ladder | Policy-set attributes are compared in fixed order; early winners hide later metrics |
| iBGP split horizon / RR | Policy cannot advertise what reflection rules forbid |
| Soft-reconfig / Refresh | Needed to re-evaluate import after map changes without hard reset |
| RPKI | Often feeds import policy (invalid → reject or lower preference) |

## Verification

```text
show ip bgp 203.0.113.0/24
show route receive-protocol bgp 192.0.2.1 detail
show bgp ipv4 unicast neighbors 192.0.2.1 routes
show bgp ipv4 unicast neighbors 192.0.2.1 advertised-routes
```

Lab checks:

1. Same prefix from two peers: only LOCAL_PREF differs → higher wins despite longer AS_PATH.
2. Import deny: prefix absent post-policy but may still appear in pre-policy soft-reconfig view.
3. Export deny: Loc-RIB has the route; peer’s Adj-RIB-Out does not.

## Risks

- Assuming “path vector” means “always pick shortest AS_PATH” → false; LOCAL_PREF and policy win earlier.
- Applying inconsistent import policy on different edge routers → asymmetric exits and hard troubleshooting.
- Changing policy without refresh/soft-reconfig capability → stale decisions until session reset.

## Interview framing

“BGP is path-vector: NLRI travels with an attribute vector including AS_PATH for loop detection, but local import/export policy—not global shortest-path math—decides acceptance and preference.”

---
