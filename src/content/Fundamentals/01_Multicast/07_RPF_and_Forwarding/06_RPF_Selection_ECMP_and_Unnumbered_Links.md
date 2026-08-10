# RPF selection, ECMP, and neighbor resolution

An RPF check is more than “a route to the source exists.” The multicast control plane must select an **upstream interface** and, for PIM joins, an **upstream neighbor** for the tree root.

## Selection inputs

Depending on the platform, the MRIB selection can consider:

- multicast-specific routes before or instead of unicast routes;
- route administrative preference/distance;
- longest prefix match;
- route metric;
- recursive next-hop resolution;
- ECMP hashing or a deterministic tie-break;
- PIM neighbor presence on the resolved interface; and
- static multicast routes or RPF overrides.

Inspect the multicast RPF result directly. `show route S` and a successful unicast ping do **not** prove which path PIM uses.

Related: [RPF check](02_RPF_Check.md), [MRIB asymmetry](03_MRIB_and_Asymmetry.md), [MBGP RPF config](../14_Configuration_and_Observation/09_MBGP_Multicast_RPF_Config_Pattern.md).

## ECMP

If several equal-cost next hops reach `S` or the RP, an implementation may select one upstream per `(S,G)`, per source, or using another stable hash. Data must arrive on the **selected** RPF interface/neighbor. A different equal-cost path is not automatically accepted merely because it has the same metric.

After a next-hop failure, the hash can move:

1. MRIB selects a surviving upstream;
2. PIM sends Join toward the new neighbor;
3. data begins on the new IIF;
4. old state is pruned/expires;
5. MFIB updates.

During the interval, packets on the old or alternate ECMP member may fail RPF or arrive twice. Measure this for loss-sensitive flows.

## Parallel links and LAGs

A routed port-channel usually presents **one** logical RPF interface even though member selection happens below it. A failure inside the LAG may change physical arrival without changing PIM state. Conversely, separate routed links are distinct RPF interfaces and need explicit ECMP behavior.

Do not use aggregate LAG bandwidth as proof that one multicast flow can use all members; platform hashing or multicast replication may pin it to one.

## Unnumbered and multiaccess links

PIM must map a recursive/unnumbered route to a real adjacent neighbor. Secondary-address Hello options help associate addresses with the correct neighbor. On multiaccess links, Assert state can override the otherwise selected upstream neighbor for a flow.

Common failure signatures: route present but “no RPF neighbor,” Join sent to the wrong neighbor address, or traffic accepted only after adding an unnecessary static mroute. Fix adjacency/address association before masking with overrides.

## Static multicast routes

A static mroute/RPF override can intentionally make multicast topology differ from unicast. Use one only with documented ownership, failover behavior, recursive reachability, and monitoring. A stale override can survive an IGP repair and create a hidden black hole.

## Configuration patterns

### Cisco IOS / IOS XE

```text
interface Port-channel10
 ip address 198.51.100.1 255.255.255.252
 ip pim sparse-mode
!
interface GigabitEthernet0/1
 ip address 198.51.100.5 255.255.255.252
 ip pim sparse-mode
!
! Equal-cost toward source prefix via IGP
! Optional pin:
ip mroute 192.0.2.0 255.255.255.0 198.51.100.2
!
show ip rpf 192.0.2.10
show ip pim neighbor
```

### Junos

```text
set protocols pim interface ae0.0 mode sparse
set protocols pim interface ge-0/0/1.0 mode sparse
set routing-options static route 192.0.2.0/24 next-hop 198.51.100.2
show pim rpf 192.0.2.10
show pim neighbor
```

### FRRouting

```text
interface eth0
 ip pim
!
interface eth1
 ip pim
!
ip mroute 192.0.2.0/24 198.51.100.2
show ip rpf 192.0.2.10
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **MBGP** | Can provide the only RPF path for a source |
| **Assert** | Overrides upstream on multiaccess |
| **BFD / IGP** | Faster next-hop loss → faster RPF churn |
| **Market-data A/B** | Independent RPF per feed source |

## Verification

For both `S` and `RP(G)` record:

```text
VRF/address family
selected route prefix and protocol
RPF interface
RPF neighbor
preference and metric
ECMP candidates and selected member
PIM adjacency on selected interface
accepted and failed RPF counters
```

Lab checks:

1. Two ECMP links up: note selected RPF; tap the other—expect RPF fail.
2. Shut selected member: Join moves; measure loss duration.
3. Unnumbered interface: confirm neighbor address resolution, not just route.
4. Remove static mroute and confirm natural RPF still works.

```text
show ip rpf 192.0.2.10
show ip mroute 192.0.2.10 232.10.10.10
show ip pim neighbor
```

## Risks

- Pinning with static mroutes “temporarily” in production.
- Expecting per-packet ECMP spray for a single `(S,G)`.
- Ignoring PIM neighbor loss on the resolved interface.

## Interview framing

“RPF selection picks one upstream interface and neighbor from the MRIB—including among ECMP members—and multicast arriving on any other equal-cost path can still fail RPF.”

---
