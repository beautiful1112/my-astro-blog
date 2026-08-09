# UPDATE error handling and treat-as-withdraw

Classic BGP often reset an entire session for malformed UPDATE attributes, causing **collateral withdrawal** of every route from that peer. **RFC 7606** defines more granular handling for many attribute errors, including:

- **treat-as-withdraw** — discard the affected NLRI as if withdrawn, keep the session;
- **attribute discard** — drop a discretionary/optional attribute where safe and continue;
- session reset — still used when errors are too severe or ambiguous for partial handling.

This improves robustness but can **hide** a persistent malformed-route problem behind partial reachability loss. Monitor malformed-update counters and per-prefix disappearance even when the session remains Established.

## Why session reset was painful

| Classic behavior | Blast radius |
|---|---|
| One bad attribute for one prefix | Entire peer session down |
| Internet full table peer | Massive reconvergence |
| Route reflector client fault | Potential cluster-wide impact |

Treat-as-withdraw confines damage to the offending NLRI set when the error is attributable.

Related: [UPDATE message](03_UPDATE_Message.md), [NOTIFICATION](../05_FSM_and_Timers/05_NOTIFICATIONS_and_Reset_Reasons.md), [Advertisements and withdrawals](../07_RIBs_and_Updates/03_Advertisements_Withdrawals_and_Replacement.md).

## Operator mental model

```text
Malformed UPDATE received
  -> classify attribute error per RFC 7606
  -> treat-as-withdraw / attribute discard / reset
  -> if treat-as-withdraw: NLRI disappears locally, session stays Established
  -> investigate malformed counters and peer software
```

Not every implementation handles every historic edge case identically—verify platform docs for your version.

## Configuration patterns (observability)

Most treat-as-withdraw behavior is default on modern code. Operators focus on detection:

### Cisco IOS / IOS XE

```text
show bgp neighbors 198.51.100.1
show ip bgp neighbors 198.51.100.1 | include malformed|error
show bgp ipv4 unicast neighbors 198.51.100.1
```

### Junos

```text
show bgp neighbor 198.51.100.1
show log messages | match bgp
# monitor hidden / withdrawn anomalies for a prefix
```

### FRRouting

```text
show bgp neighbors 198.51.100.1
show bgp ipv4 unicast 203.0.113.0/24
# check logs for attribute errors / treat-as-withdraw
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Soft-reconfig | Pre-policy copy may still show what was received before discard logic |
| Route Refresh | May reintroduce the same malformed path until peer fixed |
| NOTIFICATION | Still used when RFC 7606 requires reset or for non-UPDATE errors |
| Communities/optional attrs | Attribute discard more likely for some optional cases |

## Verification

```text
show bgp summary
# session Established while specific prefix missing
show ip bgp 203.0.113.0/24
show log | include withdraw|malformed|7606
```

Lab checks:

1. On platforms with test tools, inject malformed attribute; confirm session stays up and NLRI gone.
2. Contrast with older behavior docs/reset.
3. Confirm counters increment; fix peer; refresh; prefix returns.

## Risks

- Blindly “clearing BGP” when treat-as-withdraw already isolated the fault.
- Ignoring chronic malformed counters because the session is green.
- Assuming all vendors map every error identically to treat-as-withdraw.

## Interview framing

“RFC 7606 lets BGP treat many bad UPDATE attributes as withdraw or attribute discard instead of resetting the whole session—more stable, but you must watch malformed counters when prefixes vanish quietly.”

---
