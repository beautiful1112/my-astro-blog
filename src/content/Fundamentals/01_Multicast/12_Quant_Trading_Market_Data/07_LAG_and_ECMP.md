# LAG and ECMP considerations

One multicast flow may hash to a single member, so a 4×10G bundle does not guarantee a 15G `(S,G)` can pass. Validate:

- hash inputs and polarization;
- multicast pinning, replication, or rehash behavior;
- RPF selection after member/path failure;
- transient duplication or reordering;
- snooping and PIM state across MLAG peers.

Aggregate capacity is not per-flow capacity.

## Failure modes

| Design | Risk |
|---|---|
| Single `(S,G)` on LAG | Pins to one member → member oversubscription |
| ECMP toward source | RPF picks one; other path fails RPF ([RPF/ECMP](../07_RPF_and_Forwarding/06_RPF_Selection_ECMP_and_Unnumbered_Links.md)) |
| MLAG peer split | Dual forwarders → duplicates; or blackhole on orphan |
| A and B on same LAG | False diversity |

Related: [MLAG case](../16_Practical_Cases/15_MLAG_Failover_Duplicates_and_Loss.md), [Capacity math](05_Capacity_Math.md).

## LAG notes for market data

- Prefer **separate** physical paths for A/B rather than two groups on one port-channel.
- If LAG is unavoidable, size **each** member for the hottest `(S,G)` that can pin to it.
- Document platform behavior: multicast over LAG may always use one member, or replicate differently than unicast hash.

## Configuration patterns

### Cisco — routed port-channel with PIM

```text
interface Port-channel10
 ip address 198.51.100.1 255.255.255.252
 ip pim sparse-mode
!
interface GigabitEthernet0/1
 channel-group 10 mode active
interface GigabitEthernet0/2
 channel-group 10 mode active
!
show etherchannel 10 detail
show ip rpf 192.0.2.10
```

### Hash / polarization check (ops)

```text
# Compare member utilisation under a single hot (S,G)
show interfaces GigabitEthernet0/1 rates
show interfaces GigabitEthernet0/2 rates
# One hot, one idle → pin confirmed
```

### FRR / Linux bond (host-facing)

```text
# Bond for redundancy; do not assume 2x pps for one multicast socket
ip -details link show bond0
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **Assert** | Multiaccess/MLAG can create dual forwarders |
| **Snooping** | mrouter ports must exist on both MLAG peers as designed |
| **QoS** | Per-member schedulers see pinned load |

## Verification

1. Single feed at 8 Gb/s on 2×10G LAG—confirm member distribution.
2. Shut active member—measure gap duration and duplicate burst.
3. ECMP lab: inject data on non-RPF path—RPF fail counters rise.
4. Confirm A/B do not share one port-channel.

```text
show ip mroute 192.0.2.10 232.10.10.10
show ip rpf 192.0.2.10
```

## Risks

- Capacity tickets based on LAG sum.
- Rehash during member flap causing long reorder windows.
- Silent polarization across many groups onto one member.

## Interview framing

“LAG/ECMP aggregate bandwidth is not per-flow multicast capacity—a `(S,G)` often pins to one member, and ECMP alternate paths can fail RPF.”

---
