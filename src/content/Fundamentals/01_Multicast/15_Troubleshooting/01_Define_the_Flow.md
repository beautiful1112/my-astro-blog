# Define the exact multicast flow

Start every incident with a precise flow identity. “Multicast is down” is not a testable statement—different flows fail for different source, group, RP, ACL, scale, or application reasons.

```text
Environment/VRF:
Source S:
Group G:
UDP destination port:
Receiver/interface/VLAN:
ASM or SSM:
Expected RP for ASM:
Expected rate and TTL:
Feed session and expected sequence:
First known bad time:
```

Related: [Symptom matrix](04_Symptom_Matrix.md), [Control state from receiver](02_Control_State_From_Receiver.md), [Data from source](03_Data_From_Source.md).

## Why identity matters

| Ambiguity | Misdiagnosis |
|---|---|
| Wrong `G` | Healthy tree for a different channel |
| ASM vs SSM | Hunting RP when SSM has none |
| Wrong VRF | Empty mroute in global table |
| App port vs network | Network fine; decoder stuck |
| A vs B line | “Both down” when one NIC failed |

## Checklist before changing config

1. Write the tuple `(VRF, S, G, port, receiver if)`.
2. Name the last known good observation point.
3. Capture one known-good sequence number and timestamp source (HW vs SW).
4. Confirm whether the reporter means gaps, latency, or total silence.

## Configuration patterns (inspection only)

### Cisco

```text
show ip mroute vrf TRADING 192.0.2.10 232.10.10.10
show ip rpf vrf TRADING 192.0.2.10
show ip igmp groups vrf TRADING
show ip pim rp mapping
```

### Junos

```text
show pim join 232.10.10.10 source 192.0.2.10 detail
show pim rpf 192.0.2.10
show igmp group
```

### Linux host

```text
cat /proc/net/igmp
ss -uapn | grep 15000
tcpdump -ni eth0 'udp and dst host 232.10.10.10 and dst port 15000'
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **A/B feeds** | Debug each line’s tuple separately |
| **Anycast RP** | Same G may map to different RP addresses by site |
| **Overlays** | Document C- vs P-group if MVPN |

## Verification

Hand off a filled template; peer can reproduce without tribal knowledge. Cross-link cases: [Same VLAN no router](../16_Practical_Cases/01_Same_VLAN_No_Router.md), [SSM across VLANs](../16_Practical_Cases/02_SSM_Across_VLANs.md).

## Risks

- Clearing PIM/IGMP state before recording the tuple.
- Mixing Feed A symptoms into Feed B commands.
- Using production groups in a scratch VRF “because numbers look similar.”

## Interview framing

“First write VRF, S, G, port, receiver, ASM/SSM, RP, and when it broke—then troubleshoot that flow, not ‘multicast.’”

---
