# Outbound Route Filtering (ORF)

ORF lets a BGP speaker push a **prefix filter** (or other ORF type) to its peer so the peer suppresses matching advertisements. The receiver avoids downloading routes it would only discard with inbound policy. ORF is negotiated as a BGP capability (RFC 5291 / 5292 for prefix-list ORF).

## Why it exists

Inbound soft-reconfiguration and ordinary Route Refresh still pull the full Adj-RIB-Out from the peer, then drop locally. On Internet-scale or dense VPN RRs, that wastes:

- peer CPU and outbound queueing;
- local receive processing;
- memory if soft-reconfig inbound is also enabled.

With ORF, the upstream peer applies the filter **before** transmission.

## Capability negotiation

1. Both peers advertise ORF capability for an AFI/SAFI.
2. Modes include receive, send, or both.
3. The ORF-sending speaker (usually the route consumer) transmits ORF entries; the ORF-receiving speaker (route producer) installs them as outbound constraints.
4. Route Refresh is often used together so the peer resends the permitted set after ORF updates.

If capability negotiation fails, configured ORF is inert—inspect negotiated capabilities, not only local config.

## Prefix-list ORF workflow

```text
RR / PE  ---- advertises many VPN or Internet routes ---->  Client
Client installs inbound prefix-list intent
Client sends ORF entries to RR
RR Adj-RIB-Out toward client shrinks to allowed prefixes
```

Typical use: a PE tells a RR “only send me RTs / prefixes I import,” overlapping conceptually with **Route Target Constraint** (RTC) for VPNs. RTC is the VPN-specific, RT-oriented solution; ORF is the generic prefix-list mechanism.

## Configuration patterns

### Cisco IOS XE (conceptual)

```text
ip prefix-list ONLY-MINE seq 10 permit 203.0.113.0/24
!
router bgp 65000
 neighbor 192.0.2.1 remote-as 65000
 address-family ipv4
  neighbor 192.0.2.1 capability orf prefix-list both
  neighbor 192.0.2.1 prefix-list ONLY-MINE in
 exit-address-family
```

After ORF is active, changing the prefix-list should refresh what the peer sends. Verify with advertised-routes on the producer and received-routes on the consumer.

### Junos

Junos ORF support is platform/release specific; many Junos designs prefer **RTC**, **BGP rib-sharding**, or ordinary policy. Check the target release before relying on ORF in production.

## Interactions

| Mechanism | Compare |
|---|---|
| **Route Refresh** | Re-requests Adj-RIB-Out; does not by itself keep the peer from sending unwanted routes continuously. |
| **Soft reconfiguration inbound** | Stores pre-policy copy locally; high memory; no savings on the wire. |
| **RTC (RT Constraint)** | VPN RT membership filtering; preferred for L3VPN/EVPN scale. |
| **Maximum-prefix** | Safety brake after the fact; ORF reduces what arrives beforehand. |

## Verification

```text
show bgp neighbors 192.0.2.1 | include ORF|Outgoing
show bgp ipv4 unicast neighbors 192.0.2.1 received prefix-filter
show bgp ipv4 unicast neighbors 192.0.2.1 advertised-routes
```

Lab:

1. Negotiate ORF both.
2. Tighten consumer prefix-list; confirm producer stops advertising denied prefixes.
3. Remove ORF capability on one side; confirm full table returns after refresh.

## Risks and limits

- Only helps when the unwanted set can be expressed as ORF types the peer understands (commonly prefix-lists).
- Misbuilt ORF can silently suppress critical prefixes—treat like production filter changes.
- Not a substitute for authentication, RPKI, or export policy on the producer.

## Interview framing

“ORF negotiates a capability so a router can push a filter to its peer and stop unwanted prefixes at the source; for VPNs, RT Constraint is usually the better specialized tool.”

---
