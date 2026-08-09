# Prefix Filtering

Prefix filters constrain NLRI by address and prefix length. They are the primary authorization tool for what may enter or leave an AS.

## What good external policy commonly rejects

| Category | Examples |
|---|---|
| Default | `0.0.0.0/0` or `::/0` unless explicitly expected |
| Special-use / martians | RFC 6890 specials, documentation, loopback, link-local where inappropriate |
| Too-long prefixes | Beyond agreed max length (e.g. >/24 on some IX policies) |
| Unauthorized customer space | Outside IRR/RPKI/contract |
| Your own prefixes from outside | Hijack / leak hygiene |
| Multicast / experimental | Unless AF-specific design requires them |

A prefix-list entry includes both the **base prefix** and allowed **length range**. Confusing “subnet of” with “exact match” is a classic outage cause.

## Configuration patterns

### Cisco IOS / IOS XE

```text
ip prefix-list BOGONS deny 0.0.0.0/8 le 32
ip prefix-list BOGONS deny 10.0.0.0/8 le 32
ip prefix-list BOGONS deny 127.0.0.0/8 le 32
ip prefix-list BOGONS deny 169.254.0.0/16 le 32
ip prefix-list BOGONS deny 224.0.0.0/3 le 32
ip prefix-list BOGONS permit 0.0.0.0/0 le 32
!
ip prefix-list CUST-A permit 203.0.113.0/24
ip prefix-list CUST-A permit 203.0.113.0/24 le 28
!
route-map FROM-CUST permit 10
 match ip address prefix-list CUST-A
route-map FROM-CUST deny 20
```

### Junos

```text
set policy-options prefix-list CUST-A 203.0.113.0/24
set policy-options policy-statement FROM-CUST term 1 from prefix-list-filter CUST-A orlonger
set policy-options policy-statement FROM-CUST term 1 then accept
set policy-options policy-statement FROM-CUST term 2 then reject
```

### FRRouting

```text
ip prefix-list CUST-A permit 203.0.113.0/24 le 28
route-map FROM-CUST permit 10
 match ip address prefix-list CUST-A
route-map FROM-CUST deny 20
```

Maintain source-of-truth objects (IRR, inventory, RPKI) and **generate** filters where possible. Always maintain parallel IPv6 policy.

## Interactions

| Mechanism | Interaction |
|---|---|
| AS-path filters | Defense in depth, not a replacement |
| RPKI | Origin validation complements prefix ACLs |
| Max-prefix | Bounds volume if filters fail open |
| ORF | Can push prefix ORF upstream ([ORF](09_ORF.md)) |
| Aggregation | More-specific filters still needed for components |

## Verification

```text
show ip prefix-list CUST-A
show ip bgp neighbors 198.51.100.1 routes
show route receive-protocol bgp 198.51.100.1
! Inject a too-long and a bogon prefix in lab—both must die
```

Change window: diff the permitted set before/after; check v4 and v6 accepted counts.

## Risks

- `le 32` on a broad permit accidentally accepting the world.
- Exact-match only when customer must advertise more-specifics for TE.
- Updating v4 filters and forgetting v6.
- Relying solely on downstream peer filters for your outbound hygiene.

## Interview framing

“Prefix filters authorize NLRI by prefix and length; generate them from a source of truth, pair with AS-path and RPKI, and never confuse exact vs or-longer matches.”

---
