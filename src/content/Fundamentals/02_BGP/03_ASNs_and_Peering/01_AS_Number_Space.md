# Autonomous System numbers

An **Autonomous System Number (ASN)** identifies an AS in BGP. Original BGP encoded **two-octet** ASNs. RFC 6793 defines **four-octet** ASN support while preserving interoperability with older two-octet-only speakers through `AS_TRANS` (23456), `AS4_PATH`, and `AS4_AGGREGATOR` reconstruction rules.

## Number space and presentation

| Topic | Practice |
|---|---|
| asplain | Plain decimal integer (e.g. `4200000001`) — preferred in automation |
| asdot | Historical dotted form for some 4-byte values — avoid unless forced |
| Public ASNs | Globally unique assignments for Internet routing |
| Private-use ranges | For closed domains; must not leak to the Internet without translation/removal |
| AS 0 | Reserved; must not appear in valid AS_PATH advertisements |

Private ASN ranges (commonly referenced operationally) include the classic 16-bit private block and the 32-bit private block defined for documentation/private use. Treat IANA registries as the authority for exact bounds when writing filters.

See [Private ASNs and remove-private-AS](04_Private_ASNs_and_Remove_Private_AS.md) and [eBGP versus iBGP](02_eBGP_vs_iBGP.md).

## Four-octet interop mechanics

When a 4-byte capable speaker peers with a 2-byte-only speaker:

- The two-octet My AS field in OPEN may carry **AS_TRANS (23456)** if the real ASN does not fit.
- The real ASN is conveyed via the **4-octet AS capability** and path encoding using `AS4_PATH` as needed.
- Receiving 4-byte speakers reconstruct a usable AS_PATH; 2-byte speakers may see 23456 placeholders.

Misconfigured capability support produces confusing AS_PATH displays, broken loop detection assumptions, or session OPEN failures—verify negotiated capabilities, not only configured ASN.

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 bgp router-id 192.0.2.1
 neighbor 198.51.100.1 remote-as 4200000001
 ! ensure 4-byte ASN support on both ends (modern IOS: default)
```

### Junos

```text
set routing-options autonomous-system 65000
set protocols bgp group EXT peer-as 4200000001
set protocols bgp group EXT neighbor 198.51.100.1
```

### FRRouting

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 4200000001
```

Use asplain in configs and documentation unless a platform forces otherwise.

## Interactions

| Mechanism | Interaction |
|---|---|
| AS_PATH loop detection | Local ASN present in path → typically reject |
| Confederations | Member ASNs appear in AS_CONFED_* segments; different loop rules |
| AS override / local-AS | Rewrite ASN presentation; can break or fix CE-PE loops |
| RPKI ROAs | Authorize origin ASN for prefixes—not the entire path |

## Verification

```text
show bgp neighbors 198.51.100.1
! Local AS, remote AS, 4-byte capability
show ip bgp 203.0.113.0/24
! AS_PATH encoding / AS4 visibility
show bgp ipv4 unicast neighbors 198.51.100.1 detail
```

Lab checks:

1. Peer 4-byte to 4-byte: confirm real ASNs in OPEN/capability and AS_PATH.
2. Emulate legacy 2-byte peer if available: observe AS_TRANS and reconstructed path on the 4-byte side.
3. Inject AS 0 or private ASN toward a strict filter; confirm rejection/removal policy.

## Risks

- Filtering only on 23456 without understanding reconstruction → false loop conclusions.
- Leaking private ASNs to Internet peers → global pollution and peer rejection.
- Mixing asdot and asplain in automation → failed peer-as matches.

## Interview framing

“Modern BGP uses four-octet ASNs with RFC 6793 interop: older peers may see AS_TRANS 23456 while AS4_PATH carries the real vector; prefer asplain and never allow AS 0 or private ASNs to leak unfiltered to the Internet.”

---
