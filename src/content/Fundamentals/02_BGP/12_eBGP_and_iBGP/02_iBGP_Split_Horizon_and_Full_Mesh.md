# iBGP Split Horizon and Full Mesh

A route learned from one ordinary iBGP peer is **not** advertised to another ordinary iBGP peer. This **split-horizon** rule prevents loops because iBGP does **not** prepend the local ASN—so AS_PATH cannot detect an iBGP cycle.

## Full-mesh consequence

Without route reflection or confederations, every iBGP speaker needs a session to every other:

**sessions = n(n − 1) / 2**

The rule concerns **BGP route propagation**, not whether traffic can forward between routers. The underlay (IGP/LS) still carries packets.

## Scaling alternatives

| Design | Session scale | Main tradeoff |
|---|---|---|
| Full mesh | O(n²) | Simple path visibility |
| Route reflectors | O(n) to RRs | Path hiding / CLUSTER_LIST / placement |
| Confederations | Mesh inside sub-AS | Member-AS complexity |
| ADD-PATH | Same sessions | Advertises additional paths to fix hiding |

## Configuration patterns

### Cisco IOS / IOS XE — iBGP mesh pair

```text
router bgp 65000
 neighbor 10.0.0.2 remote-as 65000
 neighbor 10.0.0.2 update-source Loopback0
 neighbor 10.0.0.2 next-hop-self
 neighbor 10.0.0.3 remote-as 65000
 neighbor 10.0.0.3 update-source Loopback0
 neighbor 10.0.0.3 next-hop-self
```

### Junos

```text
set protocols bgp group IBGP type internal
set protocols bgp group IBGP local-address 10.0.0.1
set protocols bgp group IBGP neighbor 10.0.0.2
set protocols bgp group IBGP neighbor 10.0.0.3
set protocols bgp group IBGP export NHS
```

### FRRouting

```text
router bgp 65000
 neighbor 10.0.0.2 remote-as 65000
 neighbor 10.0.0.2 update-source lo
 neighbor 10.0.0.3 remote-as 65000
 neighbor 10.0.0.3 update-source lo
```

Demonstrate split horizon in lab: R1 learns eBGP prefix; advertises to R2; R2 must **not** advertise that iBGP-learned path to R3 unless R2 is an RR client reflector path or the route is locally originated differently.

## Interactions

| Mechanism | Interaction |
|---|---|
| next-hop-self | Common on edge→core iBGP so NH resolves ([next-hop-self](03_Next_Hop_Self.md)) |
| RR | Reflector may advertise iBGP-learned routes to clients per RR rules |
| LOCAL_PREF | Propagates over iBGP for AS-wide outbound policy |
| Confederations | Split horizon applies inside member AS; eBGP-like between members |

## Verification

```text
show ip bgp neighbors 10.0.0.2 advertised-routes
show ip bgp summary
show bgp ipv4 unicast neighbors 10.0.0.2 advertised-routes
```

## Risks

- Partial mesh without RR → inconsistent RIBs and blackholes.
- Treating “full mesh” as a data-plane requirement.
- RR clusters without ADD-PATH hiding the low-latency exit.

## Interview framing

“iBGP split horizon blocks advertising iBGP-learned routes to other iBGP peers because AS_PATH would not loop-detect; full mesh, RRs, or confederations restore propagation at scale.”

---
