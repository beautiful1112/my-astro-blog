# Layer-2 snooping configuration patterns

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

The example VLAN is `120`, with receivers on access ports, an LHR on `Port-channel10`, and an optional L2-only querier at `192.0.2.2`. Commands differ significantly by platform; treat these as design-shaped templates.

## Cisco-like template

```text
ip igmp snooping
ip igmp snooping vlan 120

! Use only when no routed multicast interface provides Queries.
ip igmp snooping querier
ip igmp snooping querier address 192.0.2.2

! If dynamic mrouter learning is unreliable, configure the exact uplink.
ip igmp snooping vlan 120 mrouter interface Port-channel10
```

Some platforms place the querier and mrouter commands under the VLAN rather than globally. Verify the operational state, not the intended syntax.

## Junos-like template

```text
set protocols igmp-snooping vlan FEED-VLAN
set protocols igmp-snooping vlan FEED-VLAN interface ae10.0 multicast-router-interface
```

Configure the platform's Layer-2 querier/source address only if the VLAN lacks a real multicast router. Confirm that the chosen address participates correctly in querier election.

## Immediate leave

Do not enable immediate/fast leave globally as a performance tweak. Restrict it to ports where the architecture guarantees one listener:

```text
safe:    one physical server, one enforced receiver
unsafe:  downstream switch, hypervisor bridge, Wi-Fi AP, IP phone/PC chain,
         MLAG/stack port, shared lab segment
```

Use normal group-specific last-listener queries on shared ports.

## Unknown multicast policy

Document the selected behavior for VLAN 120:

```text
known group:      listener ports + mrouter ports
unknown group:    flood | router-only | rate-limit | drop
link-local group: required control forwarding/exemption
```

If unknown groups are dropped, test the race between first Report and hardware entry installation. Consider a static group only for a justified always-on receiver, not to hide broken snooping.

## Source-specific and security controls

Where hardware supports them:

- enable IGMPv3 snooping/source state;
- restrict allowed groups per access port;
- restrict which ports may source multicast data;
- set group/source limits per port/VLAN;
- prevent host-facing ports from becoming mrouter ports through forged PIM/Queries;
- keep IPv4 IGMP and IPv6 MLD policy separate.

## Verification

```text
show igmp snooping vlan 120
show igmp snooping groups vlan 120
show igmp snooping mrouter vlan 120
show igmp snooping querier vlan 120
show hardware multicast ...
```

Equivalent output must prove querier identity/timer, mrouter port/reason, listener port/source filter, logical expiry, unknown policy, and ASIC replication list. Then test join, leave, querier failure, uplink move, and table exhaustion.
