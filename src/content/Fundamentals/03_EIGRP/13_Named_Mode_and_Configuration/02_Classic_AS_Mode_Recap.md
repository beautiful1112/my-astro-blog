# Classic AS mode recap

Classic configuration uses **`router eigrp <AS>`** where the process number **is** the autonomous system number. Interface-level EIGRP commands (`ip hello-interval eigrp`, `ip summary-address eigrp`, `ip split-horizon eigrp`, …) carry the AS number explicitly.

## Minimal classic shape

```text
router eigrp 100
 network 10.0.0.0 0.255.255.255
 network 192.0.2.0 0.0.0.3
 eigrp router-id 1.1.1.1
 no auto-summary
 maximum-paths 4
 variance 1

interface GigabitEthernet0/0
 ip address 192.0.2.1 255.255.255.252
 ip hello-interval eigrp 100 5
 ip hold-time eigrp 100 15
```

## Where knobs live (classic)

| Knob | Location |
|---|---|
| networks, stub, RID, variance, maximum-paths, redistribute | `router eigrp` |
| hello/hold, summary, SH, auth, bw percent | `interface` + `… eigrp <AS>` |
| IPv6 | separate `ipv6 router eigrp <AS>` |

## show commands

```text
show ip eigrp neighbors
show ip eigrp topology
show ip eigrp interfaces
show ip protocols
```

## Still valid when

- Older IOS without named-mode preference in local standards.
- Simple single-AF IPv4 labs and CCNA/CCNP-style examples.
- Brownfield devices you will migrate later (map knobs first—see migration lesson).

Keep `no auto-summary` in every classic template.

## Coexistence note

A device should not run conflicting classic and named processes for the same AF/AS without a migration plan. Prefer one style per platform image standard.

## Interview framing

“Classic: AS = process ID; many interface commands include the AS. Named: process name ≠ AS; AS sits in address-family.”

## Related

- [Named mode structure](01_Named_Mode_Structure.md)
- [Migrating classic to named](05_Migrating_Classic_to_Named.md)
- [Minimal working configs](06_Minimal_Working_Configs.md)

---
