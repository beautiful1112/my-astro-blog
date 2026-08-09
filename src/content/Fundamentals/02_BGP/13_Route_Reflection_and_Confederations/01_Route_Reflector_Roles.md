# Route-Reflector Roles

A route reflector (RR) relaxes classic iBGP split horizon for configured **clients** so an AS can scale without a full iBGP mesh. The RR still runs ordinary BGP best-path selection; reflection only changes **who may receive** a selected path.

## Roles

| Role | Meaning |
|---|---|
| **Client** | Peer configured as an RR client; learns reflected iBGP paths from the RR |
| **Non-client** | Ordinary iBGP peer of the RR (often other RRs or mesh peers) |
| **Route reflector** | Speaker that reflects among clients / between clients and non-clients |
| **Cluster** | Logical set of RRs (and their clients) identified by CLUSTER_ID |

## Advertisement rules (RFC 4456)

Simplified reflection rules for an **iBGP-learned** route on the RR:

| Learned from | May advertise to |
|---|---|
| Client | Other clients and non-clients |
| Non-client | Clients only (not other non-clients) |
| eBGP | Clients and non-clients per normal iBGP policy |

Clients do **not** need a full mesh with one another. Non-clients of one RR still need mesh (or hierarchical RR) connectivity among themselves unless another scaling mechanism covers them.

## What an RR does and does not do

- Selects **one** best path per NLRI from its own RIB viewpoint (unless ADD-PATH is used).
- Reflects that path (or ADD-PATH set) without requiring clients to peer with every other client.
- Does **not** have to forward user traffic; many RRs are control-plane-only.
- Does **not** invent better exits for clients—clients inherit the RR’s choice unless diversity tools are enabled.

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 192.0.2.11 remote-as 65000
 neighbor 192.0.2.11 update-source Loopback0
 neighbor 192.0.2.11 route-reflector-client
 address-family ipv4
  neighbor 192.0.2.11 activate
  neighbor 192.0.2.11 route-reflector-client
 exit-address-family
```

### Junos

```text
set protocols bgp group RR-CLIENTS type internal
set protocols bgp group RR-CLIENTS cluster 192.0.2.1
set protocols bgp group RR-CLIENTS neighbor 192.0.2.11
```

### FRR

```text
router bgp 65000
 neighbor 192.0.2.11 remote-as 65000
 address-family ipv4 unicast
  neighbor 192.0.2.11 route-reflector-client
 exit-address-family
```

Cluster ID defaults to the RR router-ID on many platforms; set it explicitly when redundant RRs share a cluster.

## Interactions

| Mechanism | Relationship |
|---|---|
| **ORIGINATOR_ID / CLUSTER_LIST** | Loop prevention for reflected routes—see next topic |
| **ADD-PATH** | Lets RR advertise multiple paths and reduce path hiding |
| **next-hop-self** | Often used on RRs toward clients so next hop is the RR loopback; otherwise next hop must remain resolvable |
| **Confederations** | Alternate or complementary scaling; RR is usually simpler |
| **VPNv4 / EVPN** | Same RR roles apply per address family; activate reflection per family |

## Verification

```text
show bgp ipv4 unicast neighbors 192.0.2.11
! Route reflector client: Yes
show bgp ipv4 unicast <prefix>
! Paths: which peer, Originator, Cluster list
show bgp summary
```

Confirm clients receive routes originated by other clients, and that ORIGINATOR_ID / CLUSTER_LIST appear on reflected paths.

## Design risks

- Single RR = single control-plane failure domain—deploy at least two.
- RR path hiding: clients may never see the exit that is best for *their* IGP location.
- Mis-marking a peer as client vs non-client creates blackholes or loops in the mesh design.
- Reflecting without stable loopback IGP reachability breaks next-hop resolution after RR failure/recovery.

## Interview framing

“An RR breaks iBGP split horizon for clients so they need not full-mesh; it still picks best paths from its own view, so clients can lose diversity unless ADD-PATH or careful placement is used.”

---
