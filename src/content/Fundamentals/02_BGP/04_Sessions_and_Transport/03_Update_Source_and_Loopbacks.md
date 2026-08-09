# Update source and loopback peering

**Loopback peering** decouples the BGP session from any single physical interface. Both peers must **source** TCP from the expected address (update-source / local-address) and have underlay reachability to those addresses. A common failure mode: one side sources from a physical interface while the other expects a loopback—TCP packets arrive but never match the neighbor definition.

## Why loopbacks

| Benefit | Detail |
|---|---|
| Resilience | Session survives individual link failures if alternate IGP paths exist |
| Stable endpoint | Router-ID/update-source remain constant for ops and filters |
| Multipath underlay | ECMP/IGP can move TCP without renumbering BGP neighbors |
| Consistency with iBGP design | Standard SP pattern: iBGP over loopbacks |

Costs: dependency on IGP/static reachability; need multihop for eBGP; failure detection must be designed (BFD).

Related: [Direct and multihop eBGP](02_Direct_and_Multihop_eBGP.md), [TCP 179](01_TCP_179.md).

## Matching rules that bite

1. Local update-source must equal the IP the peer configured as `neighbor`.
2. Return packets must be accepted by local TCP/BGP (ACLs, uRPF, GTSM).
3. For eBGP loopbacks, multihop/TTL and loop-prevention knobs must be explicit.
4. Router-ID is separate from update-source—do not assume they are interchangeable.

## Configuration patterns

### Cisco IOS / IOS XE

```text
interface Loopback0
 ip address 192.0.2.1 255.255.255.255
!
router bgp 65000
 neighbor 192.0.2.2 remote-as 65000
 neighbor 192.0.2.2 update-source Loopback0
```

### Junos

```text
set interfaces lo0 unit 0 family inet address 192.0.2.1/32
set protocols bgp group IBGP type internal
set protocols bgp group IBGP local-address 192.0.2.1
set protocols bgp group IBGP neighbor 192.0.2.2
```

### FRRouting

```text
router bgp 65000
 neighbor 192.0.2.2 remote-as 65000
 neighbor 192.0.2.2 update-source lo
```

eBGP variant: add `ebgp-multihop` / `multihop` and ensure `/32` reachability.

## Interactions

| Mechanism | Interaction |
|---|---|
| IGP | Usually carries loopback reachability for iBGP |
| next-hop-self | Often paired so advertised NEXT_HOP is also a loopback |
| Passive mode | One side may only listen on loopback |
| GR/BFD | BFD peer address must match the BGP endpoint design |

## Verification

```text
show bgp neighbors 192.0.2.2
! Local host / local address field
show ip route 192.0.2.2
show tcp brief
show interfaces loopback0
```

Lab checks:

1. Mismatch update-source vs neighbor address → stuck Active/Connect.
2. Remove IGP route to peer loopback → session drops; restore → returns.
3. Source from physical address accidentally; peer debug shows TCP SYNs from unexpected IP.

## Risks

- Advertising BGP NEXT_HOP as an unreachable physical address while sessions use loopbacks.
- Filtering loopback `/32`s out of IGP → mass iBGP failure.
- Anycast loopbacks for BGP endpoints without understanding TCP mid-flow problems.

## Interview framing

“Loopback peering needs matching update-source/local-address on both sides plus underlay reachability; for eBGP it also needs multihop—most ‘session won’t come up’ cases are source/address mismatches, not missing route-maps.”

---
