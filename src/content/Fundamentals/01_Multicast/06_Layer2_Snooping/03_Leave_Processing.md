# Layer-2 leave processing

When a host leaves a group, snooping normally **does not** instantly trust a single Leave. The switch (or querier) runs **group-specific queries** so other listeners behind the same port can renew. **Immediate leave / fast leave** skips that wait and removes the port at once.

Fast leave is safe only when **exactly one listener** is guaranteed behind that port. Otherwise one Leave black-holes everyone sharing the attachment.

## Message interaction (standard leave)

1. Host sends IGMPv2 Leave (or IGMPv3 TO_IN `{}` / BLOCK).
2. Querier sends group-specific queries (LMQI × LMQC).
3. Remaining hosts report; switch keeps the port.
4. If silence, port is pruned from the group.

## Message interaction (immediate leave)

1. Host Leave arrives on port P.
2. Switch immediately deletes P from `(VLAN,G)`.
3. No query wait—any other listener behind P is cut off.

Related: [Fast-leave blackhole case](../16_Practical_Cases/05_Fast_Leave_Blackhole.md), [IGMPv2 process](../05_IGMP_and_MLD/17_IGMPv2_Protocol_Process.md), [Snooping terms](02_Snooping_Control_Terms.md).

## When immediate leave is acceptable

| Attachment | Immediate leave |
|---|---|
| One physical server, one receiver process, no VM bridge | Usually OK |
| Downstream switch / daisy chain | Unsafe |
| Hypervisor / container bridge | Unsafe |
| Wi-Fi AP / phone+PC daisy chain | Unsafe |
| Server with multiple sockets on one NIC | Often unsafe |

## Configuration patterns

### Cisco-like

```text
! Global fast leave — usually wrong for access layers
! ip igmp snooping vlan 120 immediate-leave
!
! Prefer per-port where guaranteed single listener
interface Ethernet1/1
 ip igmp snooping immediate-leave
!
interface Ethernet1/10
 description downlink to ToR
 ! no immediate leave
```

### Junos

```text
set protocols igmp-snooping vlan FEED-VLAN immediate-leave
! Restrict to interfaces that are truly single-receiver
```

### Host leave (for lab)

```text
# Application drops membership; or:
ip maddr show
# observe Leave / IGMPv3 state-change report on the wire
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **Last-member query** | Standard path’s safety net |
| **Report suppression** | Can hide remaining listeners if broken |
| **Static IGMP join** | Ignores Leave from hosts |
| **MLD** | Same leave/fast-leave concepts for IPv6 |

## Verification

1. Two hosts behind one port (or downstream switch): enable fast leave; one leaves → both lose (proves hazard).
2. Disable fast leave; one leaves → remaining host survives after query/report.
3. Time the prune with LMQI/LMQC math.
4. Confirm production access policy documents where fast leave is allowed.

```text
show ip igmp snooping groups vlan 120
debug ip igmp snooping
tcpdump -ni eth0 igmp
```

## Risks

- Enabling immediate leave globally as a “latency tweak.”
- Assuming one MAC ⇒ one listener.
- Leaving fast leave on after inserting a hypervisor.

## Interview framing

“Standard leave waits for last-member queries; immediate leave prunes the port at once and is safe only with a proven single listener behind that port.”

---
