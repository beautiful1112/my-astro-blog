# Internet Exchange Route Servers

A **route server (RS)** at an IXP exchanges routes among participants while normally staying **out of the forwarding path**. Participants still forward **directly** to each other’s MAC on the IX fabric.

## Behavioral quirks

| Behavior | Implication |
|---|---|
| Often **no ASN prepend** by RS | First-AS checks need RS exceptions |
| **NEXT_HOP unchanged** | Points at participant, not RS |
| Multilateral policy on RS | Still need per-client import/export intent |
| Control ≠ data | RS session up while IX ARP/MAC to peer fails |

See [next-hop-unchanged](../12_eBGP_and_iBGP/09_Next_Hop_Unchanged.md) and [first-AS validation](../16_Security_and_Hardening/05_Prefix_AS_Path_and_First_AS_Validation.md).

## Typical path

```text
Member-A AS64501 --eBGP-- RS --eBGP-- Member-B AS64502
Data: Member-A MAC ↔ Member-B MAC on IX VLAN/VXLAN
```

AS_PATH as seen by B often starts with `64501`, not the RS ASN.

## Policy

- RS applies participant-specified filters / IRR / RPKI.
- Bilateral peering vs RS multilateral are different trust models.
- BGP Roles: route-server and route-server-client—[OTC](../17_RPKI_and_Leak_Prevention/08_BGP_Roles_and_OTC.md).

## Configuration notes (member side)

```text
router bgp 64501
 neighbor 192.0.2.254 remote-as 65534
 neighbor 192.0.2.254 no enforce-first-as
 neighbor 192.0.2.254 route-map RS-IN in
 ! next hop is other members — ensure IX connected route
```

## Verification

```text
show bgp ipv4 unicast neighbors <rs> routes
show bgp ipv4 unicast <prefix>
! NEXT_HOP = member address on IX subnet
ping <member-nh> / check ARP-ND on IX interface
```

## Interview framing

“An IX route server brokers BGP without being in the data path—often without prepending ASN and with next-hop-unchanged—so first-AS exceptions and IX L2 reachability are part of the design.”

## Member operational checklist

1. RS BGP Established and prefixes received.
2. NEXT_HOP is on the IX subnet and ARP/ND resolves.
3. Local firewall/PBR does not block participant→participant.
4. RPKI/IRR filtered set matches expectations (no surprise defaults).
5. Failover test: RS down should not break bilateral sessions if you have them.

## Interactions

| Mechanism | Note |
|---|---|
| **next-hop-unchanged** | Core RS behavior |
| **allowas-in** | Rarely related; do not confuse with RS quirks |
| **Max-prefix** | Still set on RS sessions |

---
