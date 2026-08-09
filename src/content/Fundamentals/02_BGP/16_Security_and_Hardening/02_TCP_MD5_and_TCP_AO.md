# TCP MD5 and TCP-AO

**TCP MD5** (RFC 2385) authenticates TCP segments with a shared key and remains widely deployed for BGP. **TCP-AO** (RFC 5925) adds algorithm agility and better key-rollover design, but support is less universal.

Neither encrypts routing payloads nor validates prefix ownership. Both protect the TCP session from unauthenticated injection/reset when keys match.

## Comparison

| Property | TCP MD5 | TCP-AO |
|---|---|---|
| RFC | 2385 | 5925 |
| Crypto agility | Poor (MD5) | Better (HMAC suites) |
| Key rollover | Painful / downtime-prone | Designed for MKT pairs |
| Ubiquity | Very high | Growing |
| Encrypts UPDATEs | No | No |

## Configuration patterns

### Cisco — MD5

```text
router bgp 65000
 neighbor 192.0.2.2 password 7 <key>
```

### Cisco — TCP-AO (conceptual)

```text
key chain BGP-AO tcp
 key 1
  send-id 1 recv-id 1
  cryptographic-algorithm hmac-sha-256
  key-string <secret>
router bgp 65000
 neighbor 192.0.2.2 ao BGP-AO
```

### Junos

```text
set protocols bgp group EBGP authentication-key <key>
! TCP-AO via authentication-key-chain where supported
```

### FRR

```text
router bgp 65000
 neighbor 192.0.2.2 password <key>
```

## Operational rules

- Unique keys per peer (or per peer group with care).
- Protected key delivery; rotate on schedule and on staff change.
- Test mismatch procedures: MD5/AO failure looks like **TCP never establishes**, not a BGP policy issue.
- Coordinate both ends before rotation; TCP-AO dual-key windows reduce downtime.

## Interactions

| Mechanism | Relationship |
|---|---|
| **GTSM** | Complementary hop check |
| **iACL** | Still restrict who can hit :179 |
| **IPsec** | Rare alternative for encryption + auth |
| **RPKI** | Different layer—content vs session |

## Verification

```text
show bgp neighbors 192.0.2.2
! Auth configured / TCP-AO state
show tcp brief | include 179
! mismatch → Idle/Active, no Established
```

## Interview framing

“TCP MD5 and TCP-AO authenticate the BGP TCP session; they stop third-party injection/resets but do not encrypt routes or prove prefix ownership—pair with filters and RPKI.”

---
