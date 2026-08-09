# Multicast SAFIs and the Relationship to PIM

Multiprotocol BGP can carry **multicast-related** routing information, but BGP does **not** replace multicast membership protocols or PIM tree signaling. Keep control-plane roles separate or troubleshooting becomes circular.

## Common BGP roles in multicast designs

| Mechanism | What BGP carries | What still builds trees |
|---|---|---|
| **IPv4/IPv6 multicast SAFI (SAFI 2)** | Unicast-form prefixes for **RPF** (sources, RPs) | PIM Join/Prune |
| **BGP MVPN (SAFI 5)** | C-multicast routes, PMSI, VPN membership | PE PIM / MVPN procedures |
| **Ordinary unicast BGP** | May be used for RPF if no separate MRIB policy | PIM |

SAFI 2 NLRI are ordinary prefixes identifying RPF roots—not group addresses and not `(S,G)` interest.

## Role split (memorize)

1. **IGMP/MLD** — receiver membership on LANs.
2. **PIM** — builds `(*,G)` / `(S,G)` distribution trees; uses RPF checks.
3. **BGP (multicast family or MVPN)** — supplies topology, VPN membership, or C-multicast signaling depending on SAFI.
4. **MSDP** (classic IPv4 ASM) — inter-RP source discovery when used.
5. **MFIB** — actual replication.

“MP-BGP supports multicast” ≠ “IPv4 unicast BGP builds multicast forwarding state.”

## Separate unicast vs multicast topology

```text
Unicast path:    Src -- Transit-A -- Rcv
Multicast RPF:   Src -- Transit-M -- Rcv
```

Advertise source prefixes differently in SAFI 1 vs SAFI 2 so PIM RPF prefers Transit-M while TCP uses Transit-A. Every hop on the multicast path still needs PIM (and capacity/ACL support).

## Configuration sketch (MBGP SAFI 2)

```text
router bgp 65000
 address-family ipv4 multicast
  neighbor 192.0.2.2 activate
  network 198.51.100.0 mask 255.255.255.0
 exit-address-family
```

```text
set protocols bgp group MBGP family inet multicast
```

Apply **separate** max-prefix and export policy—do not dump the full unicast table into SAFI 2.

## Interactions

| Mechanism | Relationship |
|---|---|
| **PIM RPF** | Reads MRIB / selected RPF route influenced by SAFI 2 |
| **MVPN** | Different SAFI; integrates with L3VPN RTs |
| **EVPN** | L2 multicast / BUM often uses underlay multicast or ingress replication—not SAFI 2 |
| **Unicast fallback** | Platforms may fall back to unicast RIB if multicast SAFI misses—verify actual RPF |

## Verification

```text
show bgp ipv4 multicast <source-prefix>
show ip rpf <source>
show ip pim mroute
show ip mroute
```

If unicast ping works but RPF fails, inspect SAFI 2 / MRIB before blaming PIM hellos.

## Interview framing

“Multicast SAFIs give BGP a way to advertise RPF or MVPN signaling information; PIM (and IGMP/MLD) still build trees—BGP topology alone does not create multicast forwarding state.”

---
