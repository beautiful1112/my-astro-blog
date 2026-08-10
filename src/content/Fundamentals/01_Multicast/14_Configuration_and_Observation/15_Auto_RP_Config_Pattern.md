# Auto-RP configuration pattern

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Auto-RP distributes candidate-RP announcements and mapping-agent discoveries using multicast control groups. It is common in Cisco-originated plants; Junos designs usually prefer [BSR](06_PIM_BSR_Config_Pattern.md). Theory and selection rules: [RP mapping methods](../09_Rendezvous_Point/02_RP_Mapping_Methods.md).

## Roles

```text
C-RP (Announce)  -->  224.0.1.39  -->  Mapping agent
Mapping agent    -->  224.0.1.40  -->  all PIM routers (Discovery)
```

- **Candidate RP** announces the groups it serves (`224.0.1.39` Cisco-RP-Announce).
- **Mapping agent** listens to announcements, elects preferred RP per group range, and multicasts Discovery (`224.0.1.40` Cisco-RP-Discovery).
- Ordinary routers listen to Discovery and install mappings.

## Sparse-mode bootstrap note

Announce and Discovery are multicast. A purely sparse-mode domain cannot carry them until an RP is known—the classic Auto-RP bootstrap problem. Common Cisco approaches:

- `ip pim sparse-dense-mode` on interfaces (dense for Auto-RP groups only in practice if carefully scoped); or
- `ip pim autorp listener` (or equivalent) so routers accept Discovery without densing all groups; or
- static RP / dense treatment only for `224.0.1.39` and `224.0.1.40`.

Do not densify production market-data groups as a side effect of fixing Auto-RP bootstrap.

## Design prerequisites

```text
C-RP loopback:        192.0.2.1
Mapping-agent lo:     192.0.2.2
ASM range example:    239.10.0.0/16
Announce group:       224.0.1.39
Discovery group:      224.0.1.40
SSM range:            232.0.0.0/8 (never mapped via Auto-RP)
```

## Cisco IOS / IOS XE (primary)

### Candidate RP

```text
ip multicast-routing

interface Loopback0
 ip address 192.0.2.1 255.255.255.255
 ip pim sparse-mode

ip access-list standard ASM-GROUPS
 permit 239.10.0.0 0.0.255.255

ip pim send-rp-announce Loopback0 scope 16 group-list ASM-GROUPS interval 60
```

### Mapping agent

```text
interface Loopback0
 ip address 192.0.2.2 255.255.255.255
 ip pim sparse-mode

ip pim send-rp-discovery Loopback0 scope 16
```

### Ordinary routers / interfaces

```text
interface GigabitEthernet0/0
 ip address 198.51.100.1 255.255.255.0
 ip pim sparse-mode
! or sparse-dense-mode / autorp listener per platform guidance
!
ip pim autorp listener
```

Scope TTL carefully so Auto-RP does not leak across administrative boundaries. Filter candidate RPs at the mapping agent when the platform supports it.

## Junos note

Junos multicast RP distribution is centered on **BSR** and static RP, not Cisco Auto-RP. Prefer:

```text
set protocols pim rp bootstrap {
  # see 06_PIM_BSR_Config_Pattern.md
}
set protocols pim rp static address 192.0.2.1 group-ranges 239.10.0.0/16
```

If interoperating with a Cisco Auto-RP domain, terminate Auto-RP on Cisco gear and inject a consistent static or BSR mapping toward Junos—do not assume native Auto-RP parity.

## FRRouting

```text
router
 ip multicast-routing
 ! Prefer static RP or BSR. Auto-RP is not the usual FRR design center.
 ip pim rp 192.0.2.1 239.10.0.0/16
```

Confirm any Auto-RP-related knobs against the installed FRR version; many deployments keep FRR on static/BSR only.

## Verification

```text
show ip pim rp mapping
show ip pim rp-hash 239.10.10.10
show ip pim autorp
show ip mroute 224.0.1.39
show ip mroute 224.0.1.40
```

Checklist:

1. C-RP announcements reach the mapping agent;
2. Discovery reaches every PIM router that needs the map;
3. every router selects the same RP for `239.10.10.10`;
4. SSM `232/8` is excluded from Auto-RP maps;
5. bootstrap method (listener vs sparse-dense) is documented and scoped.

## Failure tests

| Inject | Expect |
|---|---|
| Kill mapping agent | Backup agent (if any) or stale map until expiry |
| Kill active C-RP | Discovery withdraws; new RP selected after timers |
| Block 224.0.1.40 at a boundary | Downstream routers lose dynamic maps |
| Sparse-only without listener | Auto-RP never bootstraps |
| Conflicting static RP | Precedence surprise—document winner |

## Risks

- Sparse-dense accidentally flooding user groups.
- TTL/scope too high → RP maps leak to another admin domain.
- Dual mapping agents with inconsistent election results during partitions.
- Mixing Auto-RP and BSR without a written precedence policy.

---
