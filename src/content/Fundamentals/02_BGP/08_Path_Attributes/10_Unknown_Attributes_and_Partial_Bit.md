# Unknown Attributes and the Partial Bit

BGP remains extensible because a speaker can safely handle attributes it does not recognize. Behavior depends on the **Optional** and **Transitive** flags in the attribute header (see [Attribute Categories and Flags](01_Attribute_Categories_and_Flags.md)).

## Propagation rules

| Attribute class | Unrecognized behavior |
|---|---|
| Optional **transitive** | Retain and forward; set the **Partial** bit |
| Optional **non-transitive** | Discard (do not forward) |
| Well-known unrecognized / critical errors | Error handling; prefer treat-as-withdraw (RFC 7606) over full session reset when safe |

**Partial** means: some AS along the path forwarded this optional transitive attribute without fully understanding it. Partial is **not** automatically a fault.

## Why this matters operationally

New policy metadata (communities variants, experimental TE tags, some VPN-related attributes) can cross older routers without a flag-day upgrade—**if** those attributes are optional transitive. Non-transitive attributes such as **MED** or **AIGP** deliberately die at unaware or untrusted boundaries ([AIGP](11_AIGP.md)).

When a packet capture shows an unknown type code:

1. Decode Optional / Transitive / Partial / Extended Length.
2. Decide whether discard, propagate, or error handling applies.
3. Check whether local policy strips the attribute on export.

## Malformed attribute handling (RFC 7606)

Modern implementations should:

- Treat many attribute errors as **withdraw the affected NLRI**, not hard-reset the session.
- Avoid “session reset as first reaction” that amplifies a single bad UPDATE into a full-table event.

Exact treat-as-withdraw coverage is implementation- and attribute-specific—verify platform docs during incidents.

## Configuration / observation patterns

There is rarely a knob labeled “partial bit.” Operators observe attributes and control stripping via policy.

### Cisco IOS / IOS XE

```text
show ip bgp 192.0.2.0/24
debug ip bgp updates
! Use carefully in production; prefer logging + BMP collectors
```

### Junos

```text
show route receive-protocol bgp 192.0.2.1 extensive
show route advertising-protocol bgp 192.0.2.1 extensive
# Compare received vs advertised attribute sets
```

### FRRouting

```text
show bgp ipv4 unicast 192.0.2.0/24 json
! Inspect attribute lists; confirm unexpected TLVs
```

Policy example—strip unknown/unwanted transitive tags at a trust boundary:

```text
! Cisco-like conceptual: delete communities / large-communities on export to Internet
route-map TO-INTERNET permit 10
 set comm-list STRIP-INTERNAL delete
 set large-comm-list STRIP-INTERNAL-LC delete
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Communities / Large / Extended | Optional transitive; Partial may be set across mixed fleets |
| MED / AIGP | Optional non-transitive; must not rely on unaware transit |
| ORF / soft-reconfig | Change which NLRI arrive; attribute rules unchanged |
| BMP / collectors | Essential for seeing attributes Adj-RIB-In before local strip |

## Verification lab

1. Introduce an optional transitive attribute on one speaker; transit through a device that does not implement it → attribute retained with Partial.
2. Introduce an optional non-transitive attribute through an unaware speaker → attribute absent downstream.
3. Inject a malformed optional attribute (lab only) → confirm treat-as-withdraw vs session reset on the platform.

## Risks

- Interpreting Partial as “attack” and withdrawing good routes.
- Stripping transitive communities at the wrong hop and breaking provider TE.
- Depending on non-transitive metrics across third-party ASNs.
- Debugs that reset sessions or overload CPUs during live incidents.

## Interview framing

“Unknown optional transitive attributes are propagated with Partial set; unknown optional non-transitive attributes are dropped; RFC 7606 prefers treat-as-withdraw over session reset for many errors.”

---
