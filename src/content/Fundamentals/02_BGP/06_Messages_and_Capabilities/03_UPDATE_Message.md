# UPDATE message

An **UPDATE** carries reachability changes: withdrawals, path attributes, and NLRI advertisements (RFC 4271). It is the workhorse message of BGP after Established.

## Classic IPv4 unicast layout

```text
Withdrawn Routes Length | Withdrawn Routes
Total Path Attribute Length | Path Attributes
NLRI (advertised prefixes)
```

Multiple prefixes sharing identical attributes can be packed into one UPDATE. Advertising the same NLRI with new attributes is an **implicit replacement** of the previous path from that peer. Explicit withdrawals remove reachability without replacement attributes.

## MP-BGP encoding

For non-classic families (IPv6, VPN, EVPN, etc.), reachability is carried primarily in:

- `MP_REACH_NLRI` (type 14) for advertisements;
- `MP_UNREACH_NLRI` (type 15) for withdrawals;

as path attributes, with AFI/SAFI identifying the NLRI type. See later MP-BGP modules; the session and packing principles remain the same.

Related: [Advertisements and withdrawals](../07_RIBs_and_Updates/03_Advertisements_Withdrawals_and_Replacement.md), [Common header](01_Common_Message_Header.md), [Treat-as-withdraw](07_Error_Handling_Treat_as_Withdraw.md).

## Attribute packing caveats

| Topic | Implication |
|---|---|
| Same attributes | Eligible for packing into one UPDATE |
| Attribute change | New UPDATE replaces prior path for that NLRI from the peer |
| Message size | Classic 4096 / extended 65535 bounds packing efficiency |
| Partial withdraw | One UPDATE may withdraw some prefixes and advertise others |

## Configuration patterns (generate UPDATEs)

### Cisco IOS / IOS XE

```text
router bgp 65000
 address-family ipv4 unicast
  network 203.0.113.0 mask 255.255.255.0
  neighbor 198.51.100.1 activate
  neighbor 198.51.100.1 route-map SET-MED out
```

### Junos

```text
set policy-options policy-statement ORIGINATE term 1 from route-filter 203.0.113.0/24 exact
set policy-options policy-statement ORIGINATE term 1 then accept
set protocols bgp group EXT export ORIGINATE
```

### FRRouting

```text
router bgp 65000
 address-family ipv4 unicast
  network 203.0.113.0/24
  neighbor 198.51.100.1 activate
 exit-address-family
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Soft-reconfig / Refresh | Causes peers to resend UPDATEs |
| ORF | May constrain which UPDATEs are sent |
| MRAI / update pacing | Limits UPDATE send rate (implementation-specific) |
| RFC 7606 | Malformed attributes may withdraw NLRI without session reset |

## Verification

```text
show ip bgp neighbors 198.51.100.1 advertised-routes
show ip bgp neighbors 198.51.100.1 received-routes
show bgp ipv4 unicast 203.0.113.0/24
# debug / capture UPDATE packing carefully in labs only
```

Lab checks:

1. Change MED on a route → peer sees replacement, not withdraw+gap if packed cleanly.
2. Explicit `clear` withdraw vs attribute change—observe message differences in capture.
3. Advertise IPv6 only via MP_REACH; classic NLRI field empty.

## Risks

- Debugging with aggressive `debug ip bgp updates` in production → CPU overload.
- Assuming classic NLRI field always carries the prefixes (false under MP-BGP).
- Ignoring implicit replacement → “duplicate routes” confusion.

## Interview framing

“UPDATE carries withdrawals and advertisements with shared path attributes; the same NLRI with new attributes replaces the old path from that peer, and MP-BGP moves many families into MP_REACH/MP_UNREACH attributes.”

---
