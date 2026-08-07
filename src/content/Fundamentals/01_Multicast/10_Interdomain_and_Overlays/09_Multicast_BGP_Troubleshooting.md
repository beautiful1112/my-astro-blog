# Multicast BGP troubleshooting workflow

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

“BGP is established” is the multicast equivalent of “the interface is up”: useful, but far from sufficient. Troubleshoot the exact address family and the state it is supposed to feed.

## Plain MBGP / SAFI 2

For source prefix `S-prefix`:

1. **Capability:** both peers negotiated IPv4/IPv6 multicast AFI/SAFI.
2. **Received NLRI:** the source/RP prefix exists in the multicast BGP table.
3. **Policy:** inbound policy accepted it; maximum-prefix or RPKI/community policy did not suppress it unexpectedly.
4. **Best path:** inspect multicast-family AS path, local preference, MED, origin, and next hop.
5. **Next-hop resolution:** BGP next hop is resolvable through a multicast-capable path.
6. **MRIB installation:** `show rpf S` uses the intended prefix, IIF, and neighbor.
7. **PIM:** the selected interface has the correct PIM adjacency and Join policy.
8. **Data:** packets arrive on that IIF and pass RPF.

Compare the unicast and multicast tables explicitly:

```text
prefix          unicast next hop     multicast next hop     RPF winner
192.0.2.0/24    Transit-A            Transit-M              Transit-M
```

## MVPN

Check these tables as a dependency chain:

1. VPN unicast route to customer source/RP;
2. MCAST-VPN auto-discovery route and Route Targets;
3. Type 6/7 C-multicast Join route;
4. Type 5 source-active route if the profile requires it;
5. Type 1/3 PMSI advertisement and Tunnel Attribute;
6. Type 4 leaf response if requested;
7. provider tunnel/LSP and label state;
8. VRF multicast route and hardware OIL.

Route reflectors can carry BGP state while not participating in data. A correct RR table does not prove the ingress or egress PE imported, resolved, and programmed the route.

## EVPN tenant multicast

1. local IGMP/MLD listener and snooping state;
2. Type 6 SMET origination with correct EVI/Ethernet Tag/source/group;
3. Route Target import on remote VTEP;
4. Type 7/8 synchronization for multihomed Ethernet segments;
5. IMET/selective tunnel or ingress-replication destination list;
6. VXLAN encapsulation and VNI;
7. remote decapsulation and listener-facing OIF.

## Common misleading observations

| Observation | What it proves | What it does not prove |
|---|---|---|
| TCP/179 established | BGP transport is up | multicast AFI/SAFI negotiated or routes accepted |
| multicast BGP route present | NLRI passed policy | MRIB selected it |
| MRIB route correct | control topology known | PIM neighbor/tree exists |
| MVPN Type 3 present | selective binding advertised | P-tunnel/label installed |
| EVPN Type 6 present | remote interest signaled | VXLAN replication programmed |
| unicast ping succeeds | ordinary IP path works | SAFI-2 RPF or multicast data path works |

## Change correlation

Record timestamps for BGP update/withdraw, RIB best-path change, MRIB/RPF change, PIM Join/Prune, tunnel/label programming, MFIB update, and first/last data sequence. Without this timeline, it is easy to blame BGP for a later PIM or hardware delay—or miss that BGP never supplied the intended path.
