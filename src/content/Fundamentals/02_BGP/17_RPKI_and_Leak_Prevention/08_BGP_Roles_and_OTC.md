# BGP Roles and Only-to-Customer

RFC 9234 defines **BGP Roles** for eBGP relationships and the **Only-to-Customer (OTC)** attribute to help detect valley-free policy violations automatically.

## Roles

| Role | Typical relationship |
|---|---|
| Provider | Transit provider to this peer |
| Customer | Customer of this peer |
| Peer | Settlement-free peer |
| Route Server | IX RS |
| Route-Server Client | RS member |

Peers negotiate compatible roles at session setup (e.g. Provider ↔ Customer). Mismatches can prevent session establishment when strictly enforced.

## OTC attribute

OTC marks routes that should only travel **toward customers**. Propagation rules cause a speaker to detect when a route is advertised in a direction that violates valley-free expectations (e.g. peer-learned route toward another peer).

Benefits:

- Records relationship intent in the protocol, not only in tribal knowledge.
- Detects some leaks **RPKI cannot**.
- Complements local community conventions.

## Configuration sketches

### Cisco (conceptual)

```text
router bgp 65000
 neighbor 192.0.2.2 remote-as 64500
 neighbor 192.0.2.2 local-role provider strict
```

### Junos

```text
set protocols bgp group CUST neighbor 192.0.2.2 peer-as 64500
set protocols bgp group CUST local-role provider
```

Exact syntax evolves—confirm platform release notes for RFC 9234 support.

## Deployment notes

- Requires compatible implementations on both ends.
- Wrong role assignment causes false positives or session issues.
- Still keep explicit prefix/export policy—OTC **supplements**, not replaces, filters.
- Route-server roles need IX-specific care.

## Interactions

| Mechanism | Relationship |
|---|---|
| **Route leaks** | Primary detection target |
| **RPKI** | Orthogonal origin check |
| **Communities** | Legacy leak-prevention signaling |
| **First-AS** | Separate syntactic check |

## Verification

```text
show bgp neighbors 192.0.2.2
! Local Role / Remote Role / OTC capability
show bgp ipv4 unicast <prefix> detail
! OTC attribute presence
```

## Interview framing

“RFC 9234 roles encode eBGP relationships and OTC flags routes that must only go to customers—catching leaks that remain RPKI Valid—but correct role assignment and ordinary export policy remain mandatory.”

---
