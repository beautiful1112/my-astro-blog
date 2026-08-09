# Large Communities

RFC 8092 **large communities** contain three unsigned 32-bit values:

**Global Administrator : Local Data Part 1 : Local Data Part 2**

They exist largely because standard communities cannot naturally encode a **four-octet ASN** plus a useful operator-defined value. Large communities are optional transitive and compared exactly (all three fields).

## Operator convention

A common (but not mandatory) convention:

| Field | Typical content |
|---|---|
| Global Administrator | Operator ASN (including 32-bit ASNs) |
| Local Data 1 | Function, region, or peer class |
| Local Data 2 | Parameter (LP class, prepend count, PoP id) |

Example: **64500:100:20** might mean “ingress region 100, preference class 20” in one network and something else in another. Publish a registry; avoid overloading values across unrelated functions.

## Configuration patterns

### Cisco IOS / IOS XE

```text
route-map FROM-IX permit 10
 set large-community 64500:100:20 additive
!
route-map HONOR-LP permit 10
 match large-community 64500:100:20
 set local-preference 200
!
router bgp 64500
 neighbor 192.0.2.1 send-community
 neighbor 192.0.2.1 send-large-community
 neighbor 192.0.2.1 route-map FROM-IX in
```

Exact knobs vary by release (`send-community large`, `send-large-community`, etc.).

### Junos

```text
set policy-options community REG-100-LP20 members large:64500:100:20
set policy-options policy-statement FROM-IX term 1 then community add REG-100-LP20
set policy-options policy-statement HONOR term 1 from community REG-100-LP20
set policy-options policy-statement HONOR term 1 then local-preference 200
```

### FRRouting

```text
bgp large-community-list standard REG-100-LP20 permit 64500:100:20
route-map HONOR-LP permit 10
 match large-community REG-100-LP20
 set local-preference 200
!
router bgp 64500
 neighbor 192.0.2.1 send-community
 neighbor 192.0.2.1 send-large-community
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Standard communities | Prefer large communities for new 32-bit-ASN-centric APIs; migrate carefully |
| Provider TE | Many transit providers now publish large-community actions alongside classic ones |
| Partial bit / unknown attrs | Older nodes may propagate without understanding—verify end-to-end action |
| RPKI / roles | Orthogonal; large communities do not validate origin |

## Verification

```text
show bgp ipv4 unicast 192.0.2.0/24
show bgp large-community 64500:100:20
show ip bgp large-community 64500:100:20
```

Confirm the peer capability negotiation includes large communities and that export policy does not strip them before the acting AS.

## Risks

- Documenting only standard communities while peers send large-only actions.
- Matching only two fields mentally—mismatches on part 2 silently miss.
- Accepting customer large communities that request global blackhole/LP without auth.
- Capability mismatch: one side sends, the other never negotiates → silent loss of TE API.

## Interview framing

“Large communities are RFC 8092’s three 32-bit fields so operators can tag policy with four-octet ASNs; semantics are local, transitive, and only as strong as matching policy.”

---
