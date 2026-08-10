# Migrating classic to named

Move from `router eigrp <AS>` to named mode without changing DUAL behavior—only CLI placement and show commands shift. Plan for a maintenance window; neighbor resets are possible depending on method.

## Migration approach

1. **Inventory** classic process: networks, stub, redistribute, variance, interface `eigrp` commands, auth keys, summaries.
2. **Build named** config offline mapping each knob to AF / af-interface / topology base.
3. **Cut over** on lab twin first; compare topology tables and RIB.
4. On production, prefer **one process at a time** per VRF/AF; avoid dual-running conflicting AS instances on the same links.
5. Some IOS versions offer conversion helpers; do not trust blindly—diff the result.

## Mapping cheat sheet

| Classic | Named |
|---|---|
| `router eigrp 100` | `router eigrp NAME` + `address-family ipv4 unicast autonomous-system 100` |
| `network` | `network` under AF |
| `variance` / `maximum-paths` | `topology base` |
| `ip summary-address eigrp 100 …` | `af-interface` `summary-address` |
| `ip hello-interval eigrp 100` | `af-interface` `hello-interval` |
| `no ip split-horizon eigrp 100` | `af-interface` `no split-horizon` |
| `eigrp stub` | `eigrp stub` under AF |
| `ipv6 router eigrp 100` | `address-family ipv6 unicast autonomous-system 100` |

## Validation checklist

- [ ] Neighbor count identical
- [ ] Topology prefix count identical (allow summary intentional diffs)
- [ ] FD/successor next hops unchanged for critical prefixes
- [ ] Stub flags visible on spokes
- [ ] Auth still up
- [ ] No new Active/SIA during idle

```text
show ip eigrp neighbors
show eigrp address-family ipv4 neighbors
show ip route eigrp
```

## Risks

- Missing af-interface timer/auth → adjacency flap.
- Leaving `auto-summary` assumptions behind inconsistently.
- IPv6 still classic while IPv4 named—document dual CLI tax.

## Interview framing

“Migration is a CLI remap: AS moves into address-family; interface knobs into af-interface; process knobs into topology base. Validate neighbors and FD before and after.”

## Related

- [Classic AS mode recap](02_Classic_AS_Mode_Recap.md)
- [Minimal working configs](06_Minimal_Working_Configs.md)
- [Named mode IPv6](../14_IPv6_EIGRP/03_Named_Mode_IPv6.md)

---
