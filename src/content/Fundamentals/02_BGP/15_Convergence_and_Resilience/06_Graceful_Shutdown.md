# Graceful BGP Shutdown

RFC 8326 defines the well-known **GRACEFUL_SHUTDOWN** community (`65535:0`). Before planned maintenance, a speaker tags affected routes so neighbors **lower preference** and move traffic away **before** the session or link is taken down.

## Safe sequence

1. Advertise affected routes with GRACEFUL_SHUTDOWN (or local equivalent knob).
2. Confirm neighbors selected alternatives.
3. Verify traffic drained (interfaces, NetFlow, probes).
4. Disable the session or link.
5. After maintenance, remove the community / re-enable and confirm reconvergence.

Without inbound policy recognizing the community, the tag **changes nothing**.

## Neighbor policy (receiver)

Typical action: set LOCAL_PREF low (e.g. 0 or 50) on routes carrying GRACEFUL_SHUTDOWN.

### Cisco

```text
ip community-list standard GRACEFUL-SHUT permit 65535:0
route-map EBGP-IN permit 10
 match community GRACEFUL-SHUT
 set local-preference 0
route-map EBGP-IN permit 20
!
router bgp 65000
 neighbor 192.0.2.2 route-map EBGP-IN in
```

Sender may use:

```text
router bgp 65000
 bgp graceful-shutdown
! or neighbor <x> shutdown graceful
```

### Junos

```text
set policy-options community GRACEFUL-SHUT members graceful-shutdown
set policy-options policy-statement EBGP-IN term gs from community GRACEFUL-SHUT
set policy-options policy-statement EBGP-IN term gs then local-preference 0
```

## Scope

| Applies to | Does not fix |
|---|---|
| Planned PE/RR/ASBR maintenance | Unplanned fiber cuts |
| Controlled traffic shift | Missing backup paths |
| eBGP and often iBGP with policy | Detection speed (use BFD) |

## Interactions

| Mechanism | Relationship |
|---|---|
| **GR / LLGR** | Different—those retain forwarding after unexpected control loss |
| **ADD-PATH / multipath** | Needed so an alternative exists to shift onto |
| **Maintenance communities** | Many SPs use custom communities; standardize on RFC 8326 where possible |
| **RTBH** | Opposite intent (discard) vs drain to alternate |

## Verification

```text
show bgp ipv4 unicast <prefix>
! LOCAL_PREF lowered on GS-tagged path
show interface <link> | include rate
! traffic near zero before shut
```

## Interview framing

“Graceful shutdown tags routes with a well-known community so neighbors depreference them and drain traffic before a planned session teardown—both sides need matching policy.”

---
