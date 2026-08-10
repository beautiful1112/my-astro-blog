# Auto-summary legacy

**Auto-summary** makes EIGRP summarize to **classful** boundaries when advertising across major network boundaries (e.g. many 10.x specifics become 10.0.0.0/8 when crossing into another major net in classic classful thinking). On older IOS defaults this could be on; in modern designs it is a foot-gun.

## Why it breaks modern networks

- Enterprises use **discontiguous** RFC1918 space and VLSM; classful aggregates are wrong.
- Auto-summary can advertise a huge block you do not fully own behind that router → black holes or loops.
- Behavior surprises engineers who only configured `network` statements and never intended aggregates.

```text
! Classic — disable explicitly in every AS you touch
router eigrp 100
 no auto-summary
```

Named mode address-families typically do **not** use the old auto-summary model the same way; still verify and prefer **explicit** interface summaries only.

## Classic failure vignette

```text
Site A: 10.1.0.0/16 behind R1
Site B: 10.2.0.0/16 behind R2
Both in AS 100, auto-summary on, connected via 192.0.2.0/30
```

Each router may advertise **10.0.0.0/8** toward the other. Both claim the entire RFC1918 `10/8`. Traffic for the remote site becomes a coin flip or a black hole depending on metric—exactly why classful auto-summary is unacceptable.

## Verification

```text
show ip protocols
! Auto-Summary: disabled
show ip eigrp topology
show run | include auto-summary
```

If you see unexpected classful prefixes (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) without manual `ip summary-address`, suspect auto-summary or redistribution.

## Migration stance

1. `no auto-summary` everywhere (classic).
2. Replace with planned `ip summary-address eigrp` / AF interface summary.
3. Lab discontiguous site addressing to prove no classful aggregate appears.
4. Add the disable to golden templates so new routers never inherit “on.”

## Risks

- Partial migration: one region still auto-summarizes → mysterious /8 in the core.
- Operators “fix” reachability with statics instead of disabling auto-summary—technical debt.

## Interview framing

“Auto-summary is legacy classful behavior—disable it. Use manual interface summarization only.”

## Related

- [Interface summarization](03_Interface_Summarization.md)
- [Why summarize in EIGRP](01_Why_Summarize_in_EIGRP.md)
- [Null0 discard route](04_Null0_Discard_Route.md)

---
