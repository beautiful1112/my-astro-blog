# Origin-Validation Policy

Origin validation only marks routes; **local policy** decides whether Invalid is dropped, depreferenced, or ignored. Roll out carefully.

## Common policy

| State | Typical action |
|---|---|
| Valid | Accept; optional mild preference |
| NotFound | Accept with ordinary IRR/prefix policy |
| Invalid | Reject or strong depreference |

## Rollout stages

1. **Visibility** — compute state, do not enforce.
2. **Validator health** — redundant RTR, alerts.
3. **Hunt legitimate Invalids** — bad maxLength, wrong ASN, traffic-eng specifics.
4. **Coordinate ROA fixes** with customers/peers.
5. **Enforce** Invalid drop on eBGP.
6. **Review** after major table growth / ROA campaigns.

## LOCAL_PREF trap

Do **not** set extremely high LOCAL_PREF on Valid routes in a way that overrides **relationship policy** and attracts traffic through a provider instead of a customer. Origin state constrains legitimacy; it must not accidentally rewrite the commercial hierarchy.

Safe pattern: keep relationship LOCAL_PREF primary; use validation as a **reject/allow** gate or small tie-break.

## Configuration patterns

### Cisco route-map

```text
route-map RPKI-IN deny 10
 match rpki invalid
route-map RPKI-IN permit 20
 match rpki valid
route-map RPKI-IN permit 30
 match rpki not-found
```

### Junos

```text
set policy-options policy-statement RPKI-IN term invalid from validation-database invalid
set policy-options policy-statement RPKI-IN term invalid then reject
set policy-options policy-statement RPKI-IN term others then accept
```

### FRR

```text
route-map RPKI-IN deny 10
 match rpki invalid
route-map RPKI-IN permit 20
```

## Cache-failure policy

Define explicitly:

- fail-open (treat as NotFound) vs fail-closed;
- maximum VRP age;
- whether enforcement disables on RTR loss.

Test before production enforce day.

## Interactions

| Mechanism | Relationship |
|---|---|
| **OTC / roles** | Catch leaks that remain Valid |
| **Max-prefix** | Still required |
| **Customer cones** | Prefer IRR+ROA hygiene over blind Valid preference |

## Verification

```text
show bgp ipv4 unicast neighbors 192.0.2.2 routes | include [IiNn]
! sample Invalids before enforce
```

## Interview framing

“ROV policy usually drops Invalid while accepting NotFound; never let Valid preference override customer/provider LOCAL_PREF hierarchy, and define cache-failure behavior before enforcement.”

---
