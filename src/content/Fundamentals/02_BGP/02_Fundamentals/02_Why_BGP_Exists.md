# Why BGP exists

An IGP (OSPF, IS-IS, EIGRP) optimizes reachability **inside one administrative domain**. The public Internet and large multi-AS fabrics need a protocol that scales with global prefix volume, encodes business relationships, and refuses to pretend there is a single globally agreed “shortest” path.

BGP exists because interdomain routing is primarily a **policy and information-hiding** problem, not a pure graph-metric problem.

## Problems BGP was built to solve

| Requirement | Why IGPs alone fail | BGP approach |
|---|---|---|
| Global scale | Full link-state flood does not fit Internet size/churn | Incremental path-vector exchange of prefixes |
| Administrative boundaries | One IGP implies shared trust and shared topology | AS boundaries + explicit peering sessions |
| Business relationships | Shortest path ignores customer/peer/transit rules | Local policy on import/export and attributes |
| Loop prevention across orgs | IGP assumptions break at AS borders | `AS_PATH` loop detection |
| Aggregation | Host/route explosion without CIDR | Prefix NLRI with controllable aggregation |
| Controlled disclosure | Internal topology should stay internal | Export only selected reachability |
| Multiple services | Need VPN, EVPN, IPv6, flow rules, etc. | MP-BGP AFI/SAFI extensions on same sessions |

## Design priorities (intentional trade-offs)

BGP prioritizes:

- **Policy control** over mathematical optimality;
- **Stability and incremental updates** over rapid full reconvergence by default;
- **Scalable reachability advertisements** over complete topology visibility;
- **Operator intent** (LOCAL_PREF, communities, filters) over hop-count purity.

It intentionally does **not**:

- flood a complete inter-AS link-state database;
- compute a single globally shortest path that every AS must agree on;
- fate-share session health with every forwarding micro-failure (hence BFD/PIC/GR as *add-ons*).

See [Path vector and policy](03_Path_Vector_and_Policy.md) and [Peering relationships](../03_ASNs_and_Peering/03_Peering_Types_and_Relationships.md).

## Where BGP is used beyond “the Internet”

- Enterprise multi-homing and DCI;
- SP edge and core control planes (including VPN/EVPN overlays);
- Internet Exchange route-server fabrics;
- SDN/controller-assisted fabrics using BGP as the scalable distribution bus;
- Low-latency trading networks where external connectivity policy is first-class.

In all cases the *reason* is the same: scalable, policy-rich reachability exchange between trust domains.

## Interactions

| Mechanism | Interaction |
|---|---|
| IGP | Underlay inside an AS; BGP usually carries external/customer/service routes |
| Static routing | Still wins by admin distance if mis-set; BGP does not “override physics” |
| Route servers / RS | Policy and next-hop preservation become the product |
| RPKI / IRR | Attempt to constrain *which* BGP announcements deserve trust |

## Configuration patterns (why policy appears on day one)

Even a “simple” multihomed edge encodes why BGP exists—two upstreams need different export/import intent:

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 192.0.2.1 remote-as 64496
 neighbor 198.51.100.1 remote-as 64511
 address-family ipv4
  neighbor 192.0.2.1 route-map FROM-ISP1 in
  neighbor 198.51.100.1 route-map FROM-ISP2 in
  neighbor 192.0.2.1 route-map TO-ISP1 out
  neighbor 198.51.100.1 route-map TO-ISP2 out
```

### Junos

```text
set protocols bgp group ISP1 import FROM-ISP1
set protocols bgp group ISP1 export TO-ISP1
set protocols bgp group ISP2 import FROM-ISP2
set protocols bgp group ISP2 export TO-ISP2
```

Without those maps, “shortest AS_PATH” may pull transit traffic you never intended to carry.

## Verification

```text
show bgp summary
show ip bgp neighbors 192.0.2.1 advertised-routes
show route receive-protocol bgp 192.0.2.1
```

Lab checks:

1. Two upstreams, identical customer prefix: change only LOCAL_PREF and watch exit choice change without IGP metric changes.
2. Accidentally export a provider route to another provider; measure the leak.
3. Compare IGP topology visibility vs BGP’s exported prefix list—information hiding is visible.

## Risks

- Running BGP “because everyone does” inside a single small domain with no policy need → complexity without benefit.
- Assuming BGP will pick the lowest-latency path → it picks the configured policy path.
- Exposing full tables or private ASNs without filters → operational and security incidents.

## Interview framing

“BGP exists to scale interdomain routing under policy and trust boundaries; it advertises controlled reachability with AS_PATH loop detection instead of flooding a global link-state topology.”

---
