# Why exchanges use multicast

An exchange must deliver the same ordered event stream to many participants at low fan-out latency. UDP multicast lets it send one copy per distribution path rather than maintain one TCP stream per customer. It avoids per-receiver sender state and TCP head-of-line blocking.

The receiver assumes responsibility for detecting loss, arbitrating redundant lines, recovering gaps, and maintaining correct book state.

## Fan-out economics

| Model | Sender work | Coupling |
|---|---|---|
| Unicast TCP per client | O(N) encap, ACK, windows | One slow client stalls its stream |
| Unicast UDP per client | O(N) packets | No shared HOL, still O(N) bandwidth |
| Multicast UDP | O(1) per link in the tree | Receivers independent |

Inside a colo, the exchange (or market-data distributor) still pays replication at switches and last-hop NICs, but the **origin** does not pace to the slowest subscriber.

Related: [Typical feed architecture](02_Typical_Feed_Architecture.md), [UDP and multicast](../11_Host_and_Application/01_UDP_and_Multicast.md).

## What participants must own

```text
Exchange:   sequenced UDP on A/B groups, optional rewind/snapshot services
Network:    membership, trees, capacity, boundaries
Firm:       join, arbitrate, recover, stale rules, monitoring
```

“We get the multicast” is incomplete until arbitration and recovery are proven under loss.

## Interactions

| Mechanism | Relationship |
|---|---|
| **SSM** | Preferred when venue publishes fixed `S` |
| **ASM** | Still common; RP and source control required |
| **Cross-connect** | Physical diversity underpins A/B value |
| **TCP recovery** | Complements, does not replace, the live feed |

## Configuration patterns

Venue-facing hosts typically only join and rate-limit; distribution routers use PIM-SSM/SM and boundaries. Example host join intent:

```text
# Feed A
join 232.10.10.10 source 192.0.2.10 if 198.51.100.10
# Feed B
join 232.10.10.11 source 192.0.2.11 if 198.51.100.11
```

## Verification

1. Both lines deliver increasing sequences under normal load.
2. Kill one fabric—book continues via the other without stale trigger.
3. Kill recovery path only—live feed still works; large-gap test fails closed (stale).

## Risks

- Treating exchange multicast as guaranteed delivery.
- Collapsing A and B onto one NIC, switch, or uplink “temporarily.”
- Ignoring that app recovery load can DoS the firm during exchange-wide loss.

## Interview framing

“Exchanges use UDP multicast for scalable one-to-many sequenced delivery; firms—not the network—own loss detection, A/B arbitration, and recovery.”

---
