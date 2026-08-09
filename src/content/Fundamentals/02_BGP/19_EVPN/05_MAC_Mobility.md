# EVPN MAC Mobility

When a MAC moves between PEs/VTEPs, a new **Type-2** route advertises the new location with a higher **MAC Mobility sequence number**. Remote PEs prefer the newer sequence and update their MAC table / ARP binding.

## Sequence behavior

```text
PE-A advertises MAC M seq 0
Host moves to PE-B
PE-B advertises MAC M seq 1  → remotes switch to PE-B
```

Sticky / static MACs may be excluded from mobility or use special handling—platform dependent.

## Rapid sequence increments: causes

| Cause | Clue |
|---|---|
| Real VM/host move | Single move then stable |
| L2 loop | Oscillation, storms, multiple PEs |
| Duplicate MAC | Two hosts, same MAC |
| Dual-active MH error | Bad ESI / same MAC learned both sides wrongly |
| Miswired LAG | Flapping between PEs |

**Duplicate-MAC detection** can freeze or suppress learning after a threshold to contain damage.

## Troubleshooting checklist

1. Compare mobility sequence on both PEs.
2. Compare next hops / VNIs / Ethernet Tags.
3. Compare ESI (should match if MH; differ if true move).
4. Check local learn source (data-plane vs control-plane).
5. Timestamps / BMP history for flap frequency.

```text
show evpn mac <addr> detail
show bgp l2vpn evpn <mac>
! Mobility Sequence = N
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **ARP suppression** | Moves must update IP↔MAC bindings |
| **Aliasing** | MH can show multiple NH without mobility events |
| **Storm control** | Limits blast while you fix loops |

## Design rules

- Do not disable duplicate detection in production without a reason.
- During VM migration, ensure underlay/overlay reachability before traffic cut.
- Document sticky MACs for network appliances.

## Interview framing

“MAC mobility uses a sequence number on Type-2 routes so remotes follow a host to its new PE; fast sequence churn usually means loops or duplicates, not healthy migration.”

## Configuration / knob awareness

Platforms expose duplicate-MAC detection timers, freeze actions, and sticky-MAC options under EVPN / bridge-domain. Align them with orchestration (VM move frequency) so healthy migrations are not treated as attacks.

```text
show evpn mac duplicate
show bgp l2vpn evpn | include Mobility
```

---
