# HMAC-SHA authentication (named mode)

Named-mode EIGRP supports stronger **HMAC-SHA-256** (and related) authentication in addition to MD5. Prefer HMAC-SHA for new deployments; keep MD5 only where mixed classic peers require it.

## Why HMAC-SHA

| Property | MD5 | HMAC-SHA-256 |
|---|---|---|
| Algorithm strength | Legacy | Modern |
| Named mode | Yes | Yes |
| Classic-only peers | Ubiquitous | May be unavailable |
| Key chain | Yes | Yes |

Both still authenticate; neither encrypts TLVs.

## Configuration (named mode)

```text
key chain EIGRP-SHA
 key 1
  key-string AnotherSecret
!
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  af-interface default
   authentication mode hmac-sha-256
   authentication key-chain EIGRP-SHA
  exit-af-interface
  af-interface GigabitEthernet0/1
   authentication mode md5
   authentication key-chain EIGRP-LEGACY
  exit-af-interface
```

Per-`af-interface` overrides let you migrate link-by-link.

## Migration notes

1. Upgrade code to versions supporting HMAC-SHA EIGRP.
2. Deploy key chain everywhere.
3. Change mode on both ends of a link in the same window.
4. MD5 on one side and SHA on the other → adjacency fails (auth mismatch).

You cannot “half-negotiate” algorithms the way some routing stacks do for TCP-AO; EIGRP requires matching mode.

## Verification

```text
show eigrp address-family ipv4 interfaces detail
show key chain EIGRP-SHA
show eigrp address-family ipv4 neighbors
```

Look for authentication mode in interface detail; confirm neighbor uptime resets only during intentional cutover.

## Risks

- Assuming classic `ip authentication mode eigrp` supports SHA—often named-mode only.
- Mixing modes across a LAN segment with multiple neighbors.
- Forgetting `af-interface default` vs specific interface inheritance.

## Interview framing

“Named mode can use HMAC-SHA-256 with key chains; both peers must match mode and key. Use it for greenfield; MD5 remains for classic interoperability.”

## Rollout waves

Migrate a non-critical spoke first, then hubs, then remaining spokes. Keep MD5 key chains intact until the last MD5 peer is gone.

## Related

- [MD5 Authentication and Key Chains](02_MD5_Authentication_and_Key_Chains.md)
- [Operational Auth Failures](06_Operational_Auth_Failures.md)
- [Named Mode module](../13_Named_Mode_and_Configuration/)

---
