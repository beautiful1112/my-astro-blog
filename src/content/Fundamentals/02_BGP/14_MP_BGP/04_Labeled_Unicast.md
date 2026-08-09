# BGP Labeled Unicast

BGP **labeled unicast** (LU; SAFI 4) advertises an IP prefix **plus an MPLS label**. It distributes transport or service reachability across areas/ASes without using LDP alone, and is a building block for seamless MPLS, inter-AS Option C-style stitching, and 6PE-like designs.

## What is carried

| Element | Role |
|---|---|
| IP prefix (IPv4 or IPv6) | FEC / destination |
| Label | Local label the advertiser expects for that FEC |
| BGP next hop | Who to reach to use that label (usually a loopback) |
| Path attributes | Ordinary BGP policy (LOCAL_PREF, communities, …) |

Receiving PE/ASBR programs: resolve BGP next hop → push/swap toward that transport → impose the LU label as needed.

## LU vs VPN NLRI

| | Labeled unicast | VPNv4/VPNv6 |
|---|---|---|
| RD | No | Yes |
| Route targets | Not for VPN membership | Yes |
| Typical use | Transport / interdomain labels | Customer VPN routes |
| Table | Global or dedicated LU | Per-VRF import |

LU is **not** a substitute for RT-based VPN isolation.

## Typical use cases

- Inter-area / inter-AS label distribution when IGP+LDP does not extend.
- Seamless MPLS: BGP LU stitches transport across IGP islands.
- Carry PE loopbacks with labels so remote PEs can build LSP to VPN next hops.
- With [AIGP](../08_Path_Attributes/11_AIGP.md), prefer lowest-cost LU path across domains.

## Configuration patterns

### Cisco IOS XR (conceptual)

```text
router bgp 65000
 address-family ipv4 unicast
  allocate-label all
 neighbor 192.0.2.2
  address-family ipv4 labeled-unicast
   route-reflector-client
```

### Junos

```text
set protocols bgp group LU family inet labeled-unicast
set protocols bgp group LU export LU-LOOPBACKS
```

Advertise only loopbacks / transport FECs—not the entire Internet—into LU.

## Interactions

| Mechanism | Relationship |
|---|---|
| **LDP / RSVP / SR** | Underlay or alternate label distribution; avoid competing FECs without a plan |
| **VPNv4** | VPN label stacks on top of transport labeled to PE next hop |
| **RR / ADD-PATH** | LU often reflected; path hiding affects transport diversity |
| **PIC core** | Backup LU next hops speed convergence |
| **next-hop-self** | Common on ASBRs rewriting LU next hops |

## Verification

```text
show bgp ipv4 labeled-unicast <prefix>
show mpls forwarding-table <prefix>
show cef <prefix> detail
traceroute mpls ipv4 <prefix>/32
```

Control-plane presence without a wired LFIB entry still fails forwarding—inspect both BGP and label tables.

## Risks

- Advertising too many prefixes into LU explodes label scale.
- Label allocation mode mismatches (per-prefix vs per-VRF-style) confuse stitching.
- Broken IGP to LU next hop → VPN destinations unresolved.

## Interview framing

“BGP LU carries a prefix with an MPLS label for transport stitching across domains; it is not VPN NLRI—RTs and RDs belong to VPNv4/VPNv6, while LU feeds the LSP to PE next hops.”

---
