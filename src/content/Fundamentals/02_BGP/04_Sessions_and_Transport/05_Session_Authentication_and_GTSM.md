# BGP session protection

Session protection hardens the **transport peer relationship**. It does **not** validate that the peer is authorized to announce a given prefix—prefix filters, RPKI, IRR, and export policy remain mandatory.

## Common mechanisms

| Mechanism | Protects against | Notes |
|---|---|---|
| TCP MD5 (RFC 2385) | Off-path TCP spoofing/reset to a degree | Widely deployed; older crypto/key ops |
| TCP-AO (RFC 5925) | Stronger TCP authentication where supported | Key chains / algorithm agility |
| GTSM (RFC 5082) | Remote spoofing of directly connected peers | Expect received TTL near 255 |
| Infrastructure ACLs / CoPP | Unwanted control-plane packets | Must allow legitimate 179/BFD |
| Interface ACLs | Limit sources to peer addresses | Combine with GTSM when possible |

Related: [TCP 179](01_TCP_179.md), [Direct and multihop eBGP](02_Direct_and_Multihop_eBGP.md), later security module topics.

## GTSM intuition

For a directly connected peer, a legitimate packet arrives with TTL 255 (or 255 minus known hops). An Internet-sourced spoof rarely can. Multihop sessions need a carefully chosen hop count; too large weakens GTSM.

GTSM and MD5/TCP-AO solve different problems; production edges often use both plus prefix policy.

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 neighbor 198.51.100.1 password SECRET
 neighbor 198.51.100.1 ttl-security hops 1
```

### Junos

```text
set protocols bgp group EXT authentication-key SECRET
set protocols bgp group EXT neighbor 198.51.100.1
set protocols bgp group EXT ttl 255
# GTSM-like enforcement via import/rpf or firewall filters is also common
```

### FRRouting

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 neighbor 198.51.100.1 password SECRET
 neighbor 198.51.100.1 ttl-security hops 1
```

Rotate keys with planned dual-key / overlapping windows where the platform supports it; never embed production secrets in shared lab docs.

## Interactions

| Mechanism | Interaction |
|---|---|
| Passive mode | Auth still required on accepted connections |
| BFD | Protect BFD separately; spoofed BFD can drop BGP |
| Max-prefix | Limits damage from a *authenticated* abusive peer |
| Multihop | GTSM hop count must match real path length |

## Verification

```text
show bgp neighbors 198.51.100.1
! MD5/TCP-AO / TTL security fields
show ip bgp summary
! auth failures often show as Active/Idle with TCP logs
```

Lab checks:

1. Mismatched MD5 → session fails before Established.
2. GTSM hops too tight on multihop → drops; relax by one and retest.
3. Correct auth but open prefix filter → still accept a hijack announcement (proves auth ≠ route trust).

## Risks

- Believing MD5 makes RPKI unnecessary.
- GTSM on multihop with wrong hop count → chronic downtime.
- Key sprawl without rotation → compromised peer credential forever.

## Interview framing

“MD5/TCP-AO and GTSM protect the BGP TCP session from many spoofing attacks, but only policy and origin validation protect you from lies told by a peer you deliberately trust at the transport layer.”

---
