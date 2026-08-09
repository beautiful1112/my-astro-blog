# ORIGINATOR_ID and CLUSTER_LIST

Route reflection adds two BGP path attributes for **iBGP loop prevention** inside an AS. Without them, reflecting client routes among RRs and back to originators could create control-plane loops.

## Attributes

| Attribute | Type | Set by | Purpose |
|---|---|---|---|
| **ORIGINATOR_ID** | Optional non-transitive | First RR that reflects a client route | Router-ID of the iBGP speaker that originated the route *inside the AS* |
| **CLUSTER_LIST** | Optional non-transitive | Each reflecting RR | Sequence of cluster IDs the route has traversed |

ORIGINATOR_ID is **not** the BGP Identifier of an eBGP peer outside the AS; it identifies the internal originator of the reflected path.

## Loop checks

1. A speaker that receives a reflected route with **ORIGINATOR_ID equal to its own router-ID** discards the route (it originated it).
2. An RR that finds **its own CLUSTER_ID in CLUSTER_LIST** discards the route (already reflected through this cluster).

These checks replace the classic “do not advertise iBGP-learned routes to other iBGP peers” rule for the RR topology.

## Cluster ID design

| Design | Behavior |
|---|---|
| Unique CLUSTER_ID per RR | Each RR appends a distinct ID; more paths may survive across redundant RRs |
| Shared CLUSTER_ID on redundant RRs | RRs form one logical cluster; a route reflected by one may be rejected by the other if the shared ID already appears |

Shared cluster IDs are valid when two RRs are true peers serving the same client set and you intentionally treat them as one cluster. Accidental duplication of CLUSTER_ID across unrelated clusters **silently hides** routes.

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 bgp cluster-id 192.0.2.1
 neighbor 192.0.2.11 route-reflector-client
```

### Junos

```text
set protocols bgp group RR-CLIENTS cluster 192.0.2.1
```

### Verification

```text
show bgp ipv4 unicast <prefix>
! Originator: 192.0.2.50
! Cluster list: 192.0.2.1 192.0.2.2
show bgp ipv4 unicast neighbors <rr> received-routes
```

Trace a client-originated prefix: first RR sets ORIGINATOR_ID; each subsequent RR prepends its cluster ID to CLUSTER_LIST.

## Interactions

| Mechanism | Relationship |
|---|---|
| **RR client configuration** | Attributes appear only on reflected paths |
| **ADD-PATH** | Path IDs are separate from ORIGINATOR_ID / CLUSTER_LIST |
| **Confederations** | Use AS_CONFED_* segments for member-AS loops; do not confuse with CLUSTER_LIST |
| **Route-target / VPNv4** | Loop attributes still apply on the iBGP RR mesh carrying VPN families |

## Operational pitfalls

- Changing CLUSTER_ID on a live RR can cause temporary withdraws/re-advertisements and path churn.
- Clients that are **also** RRs in a hierarchy must have consistent cluster planning.
- Debugging “prefix missing on client” often shows the route discarded on CLUSTER_LIST or ORIGINATOR_ID—inspect the RR’s discarded/hidden paths if the platform exposes them.
- Router-ID changes rewrite ORIGINATOR_ID behavior; stabilize router-IDs before production RR rollout.

## Interview framing

“ORIGINATOR_ID records which iBGP speaker originated a reflected route; CLUSTER_LIST records which RR clusters reflected it—speakers drop routes that loop back to themselves or their cluster.”

---
