# Capacity and Failure Domains

BGP will happily select a backup that lacks capacity or shares the same cut fiber. Model failure domains explicitly, then verify policy leads traffic to an adequately sized path.

## Record per path

- Carrier and circuit ID; building entry / MMR / cross-connect.
- Router, line card, optic, power feed.
- Upstream ASN and whether backups share a provider backbone.
- Expected traffic after N-1 (and relevant N-2).
- Whether multipath / [link-bandwidth](../11_Policy_and_Traffic_Engineering/11_Link_Bandwidth_Community.md) assumes both links healthy.

## Policy implications

| Finding | Response |
|---|---|
| Backup shares fiber entry | Do not treat as independent; raise diversity work |
| Backup is 10G vs primary 100G | Avoid equal ECMP; use LP primary or weighted multipath |
| Both “diverse” uplinks via same transit ASN | Single ASN failure still hurts |

```text
! Prefer diverse primary; backup only when primary withdrawn
route-map FROM-CIRCUIT-A permit 10
 set local-preference 300
route-map FROM-CIRCUIT-B permit 10
 set local-preference 100
```

## Verification

```text
show bgp ipv4 unicast <vip>
# Shut primary circuit (lab) or withdraw; confirm backup next hop
# Load-test backup capacity before declaring N-1 ready
```

## Ops note

Record the intended LOCAL_PREF / community class for each VIP in the same repo as the configs so on-call does not reverse-engineer intent from live attributes alone.

---
