# Path-Attribute Categories and Flags

BGP path attributes describe a route and influence policy or selection. Every attribute in an UPDATE begins with a flags octet and a type code. Misreading those flags is a common source of “why did this attribute vanish?” incidents.

## Attribute header flags

| Bit | Name | Meaning when set |
|---|---|---|
| Optional | Attribute is not required for every speaker to recognize | Optional attributes may be unknown to some routers |
| Transitive | Attribute may cross AS boundaries when unrecognized | Works with Optional for optional transitive behavior |
| Partial | An optional transitive attribute was forwarded without complete understanding | Set by speakers that did not fully process the attribute |
| Extended Length | Length field is two octets instead of one | Used for long attribute values |

Do not confuse “transitive attribute” with “route is always exported.” Export policy can remove communities, rewrite MED, or reject the NLRI regardless of flags.

## Traditional classification

| Class | Meaning | Examples |
|---|---|---|
| Well-known mandatory | Recognized by every speaker and required in applicable UPDATEs | ORIGIN, AS_PATH, NEXT_HOP (classic IPv4 unicast) |
| Well-known discretionary | Recognized everywhere but not always present | LOCAL_PREF, ATOMIC_AGGREGATE |
| Optional transitive | Can survive speakers that do not recognize it | AGGREGATOR, standard/large communities |
| Optional non-transitive | Must not pass through an unaware speaker | MED, AIGP |

MP-BGP often carries reachability in `MP_REACH_NLRI` / `MP_UNREACH_NLRI` instead of (or in addition to) classic NEXT_HOP. The same flag model still applies to other attributes attached to the path.

## Wire interaction: unknown attributes

When a speaker does not recognize an attribute:

- **Optional transitive** → retain, set Partial, and forward (subject to policy stripping).
- **Optional non-transitive** → discard.
- **Well-known** that is unknown or malformed → treat as error (modern platforms follow RFC 7606 treat-as-withdraw where safe).

See [Unknown Attributes and the Partial Bit](10_Unknown_Attributes_and_Partial_Bit.md) and [AIGP](11_AIGP.md) for optional non-transitive examples that must stay inside a trust domain.

## Configuration patterns (inspection, not creation)

Attributes are usually set by policy, not by “flag knobs.” Operators verify flags and type codes in captures or detailed shows:

### Cisco IOS / IOS XE

```text
show ip bgp 192.0.2.0/24
show bgp ipv4 unicast 192.0.2.0/24
! Path detail lists communities, MED, LOCAL_PREF, AIGP when present
```

### Junos

```text
show route receive-protocol bgp 192.0.2.1 extensive
show route advertising-protocol bgp 192.0.2.1 extensive
```

### FRRouting

```text
show bgp ipv4 unicast 192.0.2.0/24 json
! Useful when correlating attribute presence with policy apply
```

## Interactions with policy and selection

| Mechanism | How attributes matter |
|---|---|
| Import policy | May set LOCAL_PREF, MED, communities, or drop the path before selection |
| Best-path | Compares a fixed ladder of attributes; earlier winners hide later ones |
| Export policy | May strip transitive tags at trust boundaries |
| Soft-reconfiguration / ORF | Changes which paths arrive; attributes on remaining paths still follow the same rules |

## Risks

- Stripping optional transitive communities at the wrong boundary breaks provider TE APIs.
- Assuming MED (non-transitive) will influence distant ASes.
- Treating Partial as an error; it often means “older hop did not understand this tag.”
- Forgetting Extended Length when decoding captures—mis-sized TLVs look like corruption.

## Interview framing

“Attributes are classified by well-known vs optional and transitive vs non-transitive; unknown optional transitive attributes propagate with Partial set, while unknown optional non-transitive attributes are dropped.”

---
