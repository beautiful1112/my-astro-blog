# Multicast VLAN Registration and multicast VLANs

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Multicast VLAN Registration (MVR) delivers selected multicast streams from a dedicated source or multicast VLAN to receivers in multiple access VLANs without placing the receiver hosts directly into the source VLAN.

```text
Feed source -- VLAN 900 (multicast VLAN) -- distribution switch
                                      |-- receiver VLAN 101
                                      |-- receiver VLAN 102
                                      +-- receiver VLAN 103
```

This is a controlled Layer-2 multicast feature, not normal inter-VLAN IP routing. The switch associates membership learned in receiver VLANs with streams arriving in the multicast VLAN and performs cross-VLAN replication according to MVR policy.

## Control flow

1. receiver in VLAN 101 sends IGMP Report for `G`;
2. access switch records membership on the receiver port/VLAN;
3. MVR maps `G` to the multicast VLAN;
4. an upstream Report/proxy state is created toward the source/mrouter port in VLAN 900;
5. data entering VLAN 900 is replicated to the interested receiver port while preserving the receiver's access-VLAN presentation as the implementation defines;
6. final leave processing removes only that receiver branch.

Source and receiver ports have explicit MVR roles. A trunk or peer link may carry both ordinary VLAN membership and MVR state, so the operational table must show the reason each port is included.

## Why use it

- isolate high-rate sources from subscriber/access VLANs;
- avoid one routed multicast interface/tree per receiver VLAN in a limited L2 design;
- centralize group admission and source uplinks;
- conserve source-facing replication where many access VLANs consume the same feed.

## Risks

- accidental group leakage between otherwise isolated VLANs;
- group-only hardware state admitting an unauthorized source;
- fast leave removing multiple receivers behind one port;
- source VLAN or uplink becoming a common failure domain;
- mismatch between MVR group ranges and the routed/snooping policy;
- unsupported IGMPv3 source filters or inconsistent SSM mapping;
- loops/duplicates when MVR crosses stacked or MLAG switches;
- confusing packet captures because the control Report and data belong to different VLAN contexts.

## MVR versus routing

| Requirement | MVR | PIM/L3 multicast routing |
|---|---|---|
| cross selected L2 VLANs in one switching domain | suitable | also possible but more L3 state |
| decrement TTL / enforce routed hop | no | yes |
| cross routed campus/WAN | no | yes |
| separate VRF policy | limited/platform-specific | native routing design |
| source RPF and PIM tree | no | yes |
| large subscriber L2 fan-out | common use | depends on routed edge model |

## Validation

For each channel document:

```text
source VLAN and source port
receiver VLAN and access port
group and permitted source
MVR group mapping
upstream/mrouter port
logical membership timer
hardware replication list
unknown-group and leave policy
```

Test an allowed join, denied group, spoofed source, receiver leave, uplink failure, MLAG/stack switchover, and group-range change. Verify that traffic does not leak to an unjoined receiver VLAN.
