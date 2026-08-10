# MRIB selection and asymmetric paths

PIM is **protocol-independent** because it consumes routing information from another system. The **MRIB** (Multicast RIB) may derive from the unicast RIB, multicast-specific BGP routes, static multicast routes, or rib-groups that copy selected routes into a multicast table (often `inet.2` on Junos).

**Asymmetric unicast is not automatically wrong.** Failure occurs when multicast data arrives somewhere other than the selected reverse path to `S` or the RP.

## Why asymmetry appears

| Cause | Effect on multicast |
|---|---|
| More-specific route on one side | Different RPF than return ICMP path |
| Failure-induced metric change | RPF moves; Joins lag briefly |
| VRF / policy differences | Unicast works in inet.0; RPF uses another table |
| ECMP selection | One member chosen; others fail RPF |
| Tunnels / overlays | Logical RPF iface ≠ physical tap point |
| MBGP multicast vs unicast topology | Intentional divergence |

Do **not** add a static mroute until you understand why topology and RPF disagree.

Related: [RPF check](02_RPF_Check.md), [MBGP](../10_Interdomain_and_Overlays/02_MBGP.md), [Case: unicast OK, MBGP RPF fails](../16_Practical_Cases/11_Unicast_Works_MBGP_RPF_Fails.md).

## Selection preference (typical)

Exact order is vendor-specific; always verify:

1. Explicit static multicast route / RPF override.
2. Multicast BGP (SAFI 2) / dedicated multicast RIB.
3. Unicast BGP / IGP in the configured multicast RIB.
4. Connected / local.

## Configuration patterns

### Cisco IOS / IOS XE — MBGP for RPF

```text
router bgp 65000
 address-family ipv4 multicast
  neighbor 198.51.100.2 remote-as 65000
  neighbor 198.51.100.2 activate
  network 192.0.2.0 mask 255.255.255.0
 exit-address-family
!
show ip rpf 192.0.2.10
show ip bgp ipv4 multicast 192.0.2.0
```

### Junos — rib-group into inet.2

```text
set routing-options rib-groups INET2-IMPORT import-rib [ inet.0 inet.2 ]
set protocols isis rib-group inet INET2-IMPORT
set protocols pim rib-group inet INET2-IMPORT
```

### FRRouting

```text
router bgp 65000
 address-family ipv4 multicast
  neighbor 198.51.100.2 activate
 exit-address-family
```

Full pattern: [MBGP multicast RPF config](../14_Configuration_and_Observation/09_MBGP_Multicast_RPF_Config_Pattern.md).

## Interactions

| Mechanism | Relationship |
|---|---|
| **PIM** | Joins follow MRIB RPF, not “ping path” |
| **SSM / ASM** | Same RPF machinery; root is S vs RP |
| **Static mroute** | Masks asymmetry; document ownership |
| **Assert** | Multiaccess override after MRIB pick |

## Verification

1. Compare `show ip route S` vs `show ip rpf S` (or multicast table).
2. On both ends of an asymmetric link pair, note metrics and next hops.
3. Withdraw the multicast BGP path; confirm RPF falls back as designed.
4. Reproduce with traceroute vs mroute IIF side by side.

```text
show ip route 192.0.2.10
show ip rpf 192.0.2.10
show ip bgp ipv4 multicast 192.0.2.10
```

## Risks

- Static mroute left after the real routing fix.
- Advertising sources only in unicast BGP while RPF prefers empty multicast table.
- Assuming “symmetry” because both directions have *a* path.

## Interview framing

“PIM uses the MRIB for RPF—unicast reachability is not enough when multicast BGP, rib-groups, or ECMP pick a different reverse path.”

---
