# OPEN negotiation

The **OPEN** message establishes session identity and negotiates optional behavior. It carries BGP version, the My Autonomous System field, Hold Time, BGP Identifier, and optional parameters—most importantly **capabilities**.

Capabilities negotiate extensions such as MP-BGP families, Route Refresh, four-octet ASN, graceful restart, ADD-PATH, extended messages, and BGP roles. A session can be **Established** while a configured address family remains inactive because the peer never advertised that capability.

## Key OPEN fields

| Field | Role |
|---|---|
| Version | Must be 4 for BGP-4 |
| My AS (2-octet field) | ASN or AS_TRANS when 4-byte ASN used with legacy peers |
| Hold Time | Proposal for negotiated hold (min of non-zero) |
| BGP Identifier | 32-bit speaker ID |
| Optional parameters | Capabilities (RFC 5492 style encoding in modern use) |

Malformed or unsupported mandatory parameters can trigger an **OPEN Message Error** NOTIFICATION and session closure.

Related: [OPEN message structure](../06_Messages_and_Capabilities/02_OPEN_Message.md), [Capability negotiation](../06_Messages_and_Capabilities/06_Capability_Negotiation.md), [AS number space](../03_ASNs_and_Peering/01_AS_Number_Space.md).

## Capability mismatch patterns

| Symptom | Likely OPEN issue |
|---|---|
| Established, no IPv6 | MP-BGP IPv6 capability missing one side |
| No Route Refresh | Refresh capability not negotiated; soft-reconfig needed |
| Odd AS_PATH with 23456 | 4-byte interop / AS_TRANS path |
| Feature CLI on, peer ignores | Local config ≠ peer capability advertisement |

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 address-family ipv6 unicast
  neighbor 198.51.100.1 activate
 exit-address-family
 ! OPEN will include MP-BGP capability for AFI/SAFI when activated
```

### Junos

```text
set protocols bgp group EXT family inet unicast
set protocols bgp group EXT family inet6 unicast
set protocols bgp group EXT neighbor 198.51.100.1
```

### FRRouting

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 address-family ipv4 unicast
  neighbor 198.51.100.1 activate
 exit-address-family
 address-family ipv6 unicast
  neighbor 198.51.100.1 activate
 exit-address-family
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Hold Timer | Negotiated from OPEN proposals |
| 4-byte ASN | Capability + possibly AS_TRANS in My AS field |
| GR | Capability advertises restart time / flags per family |
| Roles (RFC 9234) | Capability advertises role; mismatch may be hard error if enforced |

## Verification

```text
show bgp neighbors 198.51.100.1
! Negotiated capabilities section
show ip bgp neighbors 198.51.100.1 | begin Capabilities
show bgp neighbor 198.51.100.1 | match "NLRI|Capability|Hold"
```

Lab checks:

1. Activate IPv6 only on one side; session Established; family inactive.
2. ASN mismatch; capture OPEN error NOTIFICATION.
3. Compare configured families to “negotiated” list—never trust config alone.

## Risks

- Assuming CLI “activate” forces the peer to accept a family.
- Ignoring Hold Time in OPEN when troubleshooting keepalive flaps.
- Duplicate BGP Identifiers across speakers → operational confusion and collision oddities.

## Interview framing

“OPEN negotiates version, ASNs, Hold Time, router-ID, and capabilities; Established only means OPEN/keepalive succeeded—each AFI/SAFI still depends on matching capability advertisements.”

---
