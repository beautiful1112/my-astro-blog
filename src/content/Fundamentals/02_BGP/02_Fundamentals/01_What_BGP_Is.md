# What BGP is

BGP-4 (RFC 4271) is the Internet’s inter-Autonomous-System routing protocol. A BGP route pairs destination **NLRI**—normally an IP prefix—with **path attributes** that describe how the destination was learned and how policy should treat it. Speakers exchange routes **incrementally** over long-lived peer sessions rather than periodically flooding full topology.

BGP is a **path-vector** protocol: `AS_PATH` records the sequence of ASes a route traversed, provides inter-AS loop detection, and serves as a major policy input. BGP is **not** a shortest-path protocol in the OSPF/IS-IS sense. Operators routinely prefer a commercially or operationally desirable path over the numerically shortest AS path.

## What BGP owns and what it does not

| BGP owns | BGP does not own |
|---|---|
| Reachability advertisements and withdrawals | Per-packet forwarding decisions in the ASIC/FIB |
| Path attributes and policy application points | Guaranteed global “best” path agreement across ASes |
| Session state (FSM) and capability negotiation | Automatic IGP-style fast reconvergence without extensions |
| Eligibility and best-path *among BGP paths* | Winning against static/IGP when admin distance prefers them |

Base BGP supports **destination-based** forwarding: it advertises where prefixes are reachable; the router’s RIB/FIB and recursive next-hop resolution determine actual packet forwarding. Extensions (MP-BGP, FlowSpec, EVPN, SR Policy, and others) reuse the same session and attribute model for additional NLRI types.

## Mental model

```text
Long-lived TCP session
  -> OPEN / capabilities
  -> incremental UPDATEs (advertise / withdraw / replace)
  -> local policy + decision process
  -> optional install into RIB/FIB
  -> per-neighbor export
```

“Session Established” means the control channel is up. It does **not** mean any family is active, any prefix is accepted, or any packet will follow the path you expect. See [Control plane versus data plane](04_Control_Plane_vs_Data_Plane.md).

## Interactions

| Mechanism | Interaction |
|---|---|
| IGP | Provides underlay reachability for iBGP/next hops; does not replace BGP policy |
| TCP | Reliable byte stream for messages; TCP up ≠ useful routing |
| MP-BGP | Same protocol, different AFI/SAFI NLRI encodings |
| RPKI / filters | Constrain which BGP paths are eligible; still BGP underneath |

## Configuration patterns (minimal identity)

### Cisco IOS / IOS XE

```text
router bgp 65000
 bgp router-id 192.0.2.1
 neighbor 198.51.100.1 remote-as 64496
 address-family ipv4 unicast
  neighbor 198.51.100.1 activate
  network 203.0.113.0 mask 255.255.255.0
 exit-address-family
```

### Junos

```text
set routing-options router-id 192.0.2.1
set routing-options autonomous-system 65000
set protocols bgp group EXT type external
set protocols bgp group EXT peer-as 64496
set protocols bgp group EXT neighbor 198.51.100.1
```

### FRRouting

```text
router bgp 65000
 bgp router-id 192.0.2.1
 neighbor 198.51.100.1 remote-as 64496
 address-family ipv4 unicast
  neighbor 198.51.100.1 activate
  network 203.0.113.0/24
 exit-address-family
```

## Verification

```text
show bgp summary
show ip bgp summary
show bgp neighbor 198.51.100.1
show route protocol bgp
```

Lab checks:

1. Session Established with zero prefixes—explain what is still unproven.
2. Originate one prefix; confirm Adj-RIB-Out toward the peer and Loc-RIB locally.
3. Shut the underlay next hop while leaving BGP up; observe control vs data failure.

## Risks

- Treating BGP as “Internet OSPF” → wrong expectations on convergence and metric meaning.
- Equating protocol presence with forwarding correctness → silent blackholes.
- Ignoring extensions’ NLRI semantics while reusing IPv4 unicast intuition.

## Interview framing

“BGP-4 is a policy-driven path-vector protocol that exchanges NLRI plus attributes over TCP sessions; AS_PATH prevents inter-AS loops, but local policy—not global shortest path—decides what is preferred and advertised.”

---
