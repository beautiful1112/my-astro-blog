# Multiprotocol BGP for multicast

Multiprotocol BGP can advertise one set of IP reachability for unicast forwarding and another set for multicast RPF. This is commonly called **MBGP**, although it is ordinary BGP with a multicast address family rather than a separate protocol.

## Address families and attributes

The relevant AFI/SAFI combinations are:

| Network layer | AFI | SAFI | Meaning |
|---|---:|---:|---|
| IPv4 multicast reachability | 1 | 2 | IPv4 prefixes used for multicast forwarding/RPF |
| IPv6 multicast reachability | 2 | 2 | IPv6 prefixes used for multicast forwarding/RPF |

Peers advertise the AFI/SAFI capability during BGP session establishment. Both sides must advertise the same capability before they can exchange that family.

Reachable prefixes and their next hop are carried in `MP_REACH_NLRI` (path attribute type 14). Withdrawn prefixes are carried in `MP_UNREACH_NLRI` (type 15). The usual BGP path attributes—AS path, local preference, MED, communities, and routing policy—can influence multicast-family best-path selection.

## What the NLRI represents

The multicast SAFI carries **ordinary unicast-form IP prefixes identifying sources, RPs, or other RPF roots**. It does not advertise multicast group addresses and does not advertise receivers.

For example:

```text
IPv4 unicast SAFI:   192.0.2.0/24 via ISP-A
IPv4 multicast SAFI: 192.0.2.0/24 via multicast exchange ISP-B
```

Unicast traffic to `192.0.2.10` can follow ISP-A while PIM Join/RPF state for source `192.0.2.10` follows ISP-B.

## Relationship to the MRIB

The BGP multicast-family best path must be installed or made available to the MRIB. PIM then uses it to:

- choose the RPF interface and neighbor toward `S` for `(S,G)`;
- choose the RPF path toward `RP(G)` for `(*,G)`;
- send Join/Prune messages along the multicast topology; and
- calculate PIM Assert preference/metrics where the implementation derives them from that route.

Route preference between multicast SAFI, unicast fallback, IGP, and static mroutes is implementation-specific. Inspect the actual multicast RPF result rather than assuming the multicast BGP best path won.

## What MBGP does not do

MBGP does not:

- carry multicast data packets;
- advertise `(S,G)` receiver interest;
- create PIM state;
- discover ASM sources between RPs;
- replace IGMP/MLD, PIM, an RP, or MSDP; or
- guarantee that its next-hop interface runs PIM.

It supplies topology. PIM supplies tree signaling, MSDP may supply IPv4 ASM source discovery, and the data plane supplies replication.

## Separate-topology example

```text
                    unicast path
Source AS 65010 ---- Transit-A ---- Receiver AS 65020
       \                                  /
        +---------- Transit-M -----------+
                 multicast path
```

The ASes exchange ordinary reachability through Transit-A and multicast SAFI routes through Transit-M. The multicast route to the source prefix selects the Transit-M-facing interface as RPF. PIM must form across every hop of that multicast path, and multicast data must return along the reverse of the Join path.

If the unicast route works but the SAFI-2 route or PIM adjacency fails, applications can reach the source by ping/TCP while multicast RPF fails.

## Policy design

- advertise only authorized source and RP prefixes;
- set maximum-prefix limits separately for the multicast family;
- control default-route origination deliberately—a multicast default can attract every unknown source;
- preserve an appropriate next hop across iBGP and route reflectors;
- attach communities identifying multicast-capable paths or source classes;
- prevent accidental redistribution of the complete unicast table into SAFI 2;
- confirm that the selected links have PIM, MTU, ACL, and capacity support.

## Failure behavior

When a multicast BGP route changes, the sequence is:

1. BGP selects and exports a new multicast-family best path;
2. the MRIB changes RPF interface/neighbor;
3. PIM moves `(*,G)` or `(S,G)` Join state;
4. upstream routers construct the replacement branch;
5. data begins arriving on the new IIF;
6. old state is pruned or expires; and
7. MFIB replication is reprogrammed.

BGP convergence alone does not measure multicast convergence. Record the full Join and data transition.
