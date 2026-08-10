# Multicast symptom matrix

Map symptoms to likely layers before changing RP or clearing state. Always bind the matrix to a concrete flow ([Define the flow](01_Define_the_Flow.md)).

| Symptom | Likely causes | Next commands / links |
|---|---|---|
| Nobody receives | source/group/interface/TTL, FHR or RP failure | [Data from source](03_Data_From_Source.md) |
| One VLAN fails | membership/PIM state, boundary, LHR OIL/RPF | [Control from receiver](02_Control_State_From_Receiver.md) |
| One host fails | wrong NIC join, firewall, ring/socket/app drops | [Host bottleneck lab](../18_Labs/07_Host_Bottleneck.md) |
| Works then stops | missing querier or timer mismatch | [No querier](../18_Labs/03_No_Querier.md), [case](../16_Practical_Cases/01_Same_VLAN_No_Router.md) |
| Join visible, no data | source/RP/RPF/data path | [RPF case](../16_Practical_Cases/03_RPF_Failure_After_Route_Change.md) |
| Null OIL | no downstream interest or expired/pruned state | `show ip mroute`, IGMP groups |
| RPF failures rise | packet arrives on non-selected reverse path | `show ip rpf`, ECMP/LAG notes |
| Duplicates | dual forwarders, A/B not arbitrated, convergence/loop | [MLAG case](../16_Practical_Cases/15_MLAG_Failover_Duplicates_and_Loss.md) |
| Burst-only gaps | congestion, NIC ring, socket, scheduling, policing | [Microbursts](06_Microburst_Debugging.md) |
| Existing ASM works, new join fails | RP reachability/mapping/synchronization | [ASM RP failure](../16_Practical_Cases/04_ASM_After_RP_Failure.md) |
| Wrong SSM source received | ASM join, compatibility downgrade, spoofing | IGMP v3 INCLUDE decode |
| Unicast OK, multicast RPF fail | MBGP/MRIB diverge | [MBGP case](../16_Practical_Cases/11_Unicast_Works_MBGP_RPF_Fails.md) |
| Capture OK, app gaps | host path | [case](../16_Practical_Cases/06_Capture_Sees_Data_Application_Gaps.md) |
| A and B fail together | shared fate | [case](../16_Practical_Cases/07_AB_Feeds_Fail_Together.md) |

## Triage order

```text
1. Fill flow template
2. Match symptom row
3. Receiver-upstream control OR source-downstream data (not both randomly)
4. Capture only at disputed boundary
5. Change one control at a time
```

## Configuration patterns (quick compare)

```text
show ip igmp groups
show ip mroute 192.0.2.10 232.10.10.10
show ip rpf 192.0.2.10
show ip pim rp mapping
ethtool -S eth0
nstat -az | grep Udp
tcpdump -ni eth0 -vv 'igmp or (udp and dst host 232.10.10.10)'
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **Assert / DR** | Duplicates or silent alternate forwarder |
| **Boundary** | Looks like null OIL or silent drop |
| **QoS police** | Burst-only gaps with healthy average rates |

## Verification

Reproduce the symptom in a lab row from [Labs](../18_Labs/README.md) when possible; attach counters that prove the matrix row.

## Risks

- Clearing all PIM state because the matrix row was “one host.”
- Treating duplicates as “good redundancy” without arbitration.

## Interview framing

“Use a symptom matrix keyed to one `(S,G)` flow—VLAN vs host vs RPF vs burst vs RP—then run the matching upstream or downstream ladder.”

---
