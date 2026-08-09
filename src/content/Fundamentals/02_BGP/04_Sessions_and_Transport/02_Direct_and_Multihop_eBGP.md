# Direct and multihop eBGP

**Direct eBGP** normally peers across a connected link using the interface addresses. Many implementations send BGP IP packets with **TTL 1** by default, limiting off-link exposure.

**Multihop eBGP** is required when peers use loopbacks, cross intermediate routers, or need resilient reachability that is not fate-shared with a single physical link. It improves session resilience but can **conceal** broken forwarding paths if recursive reachability remains while the intended traffic path is dead.

## Comparison

| Aspect | Direct eBGP | Multihop eBGP |
|---|---|---|
| Neighbor address | Connected interface | Often loopback / reachable via routing |
| TTL default (typical) | 1 | Must raise (`ebgp-multihop` / TTL) |
| Failure signal | Link down often kills session | Session may survive link loss |
| GTSM fit | Excellent (expect TTL 255) | Harder; hop count must be known |
| Next-hop | Usually peering address | Still must resolve; design carefully |

Related: [Update source and loopbacks](03_Update_Source_and_Loopbacks.md), [GTSM](05_Session_Authentication_and_GTSM.md), [eBGP versus iBGP](../03_ASNs_and_Peering/02_eBGP_vs_iBGP.md).

## Requirements for multihop

1. Bidirectional IP reachability to the neighbor addresses;
2. Sufficient TTL/hop limit both ways;
3. Stable **update-source** matching what the peer expects;
4. Explicit failure detection (BFD recommended) because link down ≠ session down;
5. Routing policy that still makes sense when the session stays up over a backup underlay.

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 192.0.2.2 remote-as 64496
 neighbor 192.0.2.2 update-source Loopback0
 neighbor 192.0.2.2 ebgp-multihop 2
 ! or: neighbor 192.0.2.2 ttl-security hops 2
```

### Junos

```text
set protocols bgp group EXT type external
set protocols bgp group EXT multihop ttl 2
set protocols bgp group EXT local-address 192.0.2.1
set protocols bgp group EXT peer-as 64496
set protocols bgp group EXT neighbor 192.0.2.2
```

### FRRouting

```text
router bgp 65000
 neighbor 192.0.2.2 remote-as 64496
 neighbor 192.0.2.2 update-source lo
 neighbor 192.0.2.2 ebgp-multihop 2
```

Some platforms use `disable-connected-check` when peering to a non-connected address without classic multihop TTL tricks—still verify reachability and security implications.

## Interactions

| Mechanism | Interaction |
|---|---|
| Loopback peering | Almost always implies multihop for eBGP |
| BFD | Restores fast failure detection lost when bypassing link fate-share |
| next-hop-unchanged | Common in some multihop IX/route-server designs |
| Static routes to peer loopbacks | Can keep BGP up while IGP is wrong—dangerous |

## Verification

```text
show bgp neighbors 192.0.2.2
! External link, TTL/multihop, local address
show ip route 192.0.2.2
traceroute 192.0.2.2
show bfd neighbors
```

Lab checks:

1. Direct session with TTL 1; insert a router in between → session fails until multihop.
2. Multihop with BFD; fail the primary link → measure session tear vs traffic shift.
3. Keep multihop session up via backup IGP path while primary forwarding path for NLRI is blackholed—observe the concealment problem.

## Risks

- Multihop without BFD → long outages waiting for Hold Timer.
- Overly large TTL → expands spoofing/attack surface unless other protections exist.
- Assuming session health equals customer traffic health on the intended circuit.

## Interview framing

“Direct eBGP usually fate-shares with a link and TTL 1; multihop eBGP needs reachability, raised TTL, matching update-sources, and explicit failure detection because the session can survive while forwarding does not.”

---
