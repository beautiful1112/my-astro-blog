# BGP control plane versus data plane

BGP learning a route does **not** guarantee forwarding. The control plane stores and selects paths; the data plane forwards packets using programmed FIB entries (and any tunnels/labels those entries imply). Outages often sit exactly on the seam between those planes.

## Pipeline

```text
Peer UPDATE
  -> Adj-RIB-In
  -> import policy
  -> eligible BGP paths
  -> best-path decision
  -> Loc-RIB
  -> RIB install competition / recursion
  -> FIB / hardware programming
  -> export policy
  -> peer-specific Adj-RIB-Out
```

A path can be valid and best **within BGP** yet fail installation because:

- NEXT_HOP is unresolved or recursively unusable;
- a more-preferred protocol (connected/static/IGP) owns the prefix;
- hardware scale or programming fails;
- policy installs a discard/null next hop by design (RTBH);
- the address family is negotiated but not activated in forwarding VRFs.

“Session Established” proves none of the stages after TCP/OPEN.

## Stage isolation for troubleshooting

| Symptom | Likely stage | First evidence |
|---|---|---|
| No TCP / Idle-Active | Transport / FSM | `show bgp summary`, TCP debug, ACL/GTSM |
| Established, 0 prefixes | Policy / family / export on peer | negotiated capabilities, received-routes |
| In table, not best | Best-path / eligibility | path comparison detail |
| Best in BGP, not in RIB | Install / admin distance | `show ip route` vs `show ip bgp` |
| In RIB, wrong traffic | FIB / recursion / LPM | CEF/FIB, longer prefix, asymmetry |
| Local OK, peer missing | Export / split horizon | advertised-routes |

See [Three conceptual RIBs](../07_RIBs_and_Updates/01_Three_Conceptual_RIBs.md) and [Next-hop resolution](../07_RIBs_and_Updates/04_Next_Hop_Resolution.md).

## Interactions

| Mechanism | Interaction |
|---|---|
| IGP | Often resolves BGP NEXT_HOP; IGP failure blackholes BGP “best” paths |
| BFD | Speeds *session* failure detection; does not fix unresolved next hops alone |
| PIC / FRR | Data-plane precomputation for backup paths; still needs valid alternates in control plane |
| Graceful restart | May retain forwarding while control plane restarts—planes temporarily diverge by design |

## Configuration patterns (exposing the seam)

Force a visible control/data split in the lab with unresolved next hop vs next-hop-self:

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 10.0.0.2 remote-as 65000
 neighbor 10.0.0.2 update-source Loopback0
 ! omit next-hop-self initially to preserve eBGP next hop
 address-family ipv4
  neighbor 10.0.0.2 activate
```

### Junos

```text
set protocols bgp group IBGP type internal
set protocols bgp group IBGP local-address 10.0.0.1
set protocols bgp group IBGP neighbor 10.0.0.2
# export next-hop self only after observing inaccessible paths
```

### FRRouting

```text
router bgp 65000
 neighbor 10.0.0.2 remote-as 65000
 neighbor 10.0.0.2 update-source lo
 address-family ipv4 unicast
  neighbor 10.0.0.2 activate
  ! add: neighbor 10.0.0.2 next-hop-self
 exit-address-family
```

## Verification

```text
show ip bgp 203.0.113.0/24
show ip route 203.0.113.0
show ip cef 203.0.113.10
show bgp ipv4 unicast 203.0.113.0/24
show route 203.0.113.0/24 extensive
```

Lab checks:

1. BGP best path present, `show ip route` missing → document why (next hop / AD).
2. Route in RIB, traceroute diverges → LPM to more-specific or asymmetric return path.
3. Soft-clear import policy and re-check each pipeline stage for one NLRI.

## Risks

- Clearing BGP because ping fails → destroys control-plane evidence while data-plane root cause remains.
- Trusting “RIB hit” without FIB/hardware confirmation on scaled platforms.
- Assuming GR “keeps the network up” without validating retained forwarding state actually matches policy intent.

## Interview framing

“Control plane selects and advertises BGP paths; data plane forwards only after RIB/FIB install and next-hop recursion succeed—Established BGP never proves packets follow that path.”

---
