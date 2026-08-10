# Default route injection

Campus and WAN edges often need `0.0.0.0/0` inside EIGRP. Cisco offers several mechanisms; pick one deliberate design and avoid mixing legacy knobs.

## Methods

| Method | Mechanism | Notes |
|---|---|---|
| Redistribute static default | `ip route 0.0.0.0 0.0.0.0 …` + `redistribute static` | Common; needs seed metric + filter |
| `ip default-network` | Legacy classful “candidate default” | Avoid in new designs |
| Summary `0.0.0.0/0` | `ip summary-address eigrp ASN 0.0.0.0 0.0.0.0` | Injects default out an interface; Null0 locally |
| Propagate flag / exterior | Older exterior bit behavior | Prefer explicit static/summary |

## Redistribute static (preferred pattern)

```text
ip route 0.0.0.0 0.0.0.0 203.0.113.1
!
ip prefix-list DEFAULT-ONLY seq 10 permit 0.0.0.0/0
route-map STATIC-TO-EIGRP permit 10
 match ip address prefix-list DEFAULT-ONLY
 set tag 1
 set metric 100000 1000 255 1 1500
route-map STATIC-TO-EIGRP deny 100
!
router eigrp 100
 redistribute static route-map STATIC-TO-EIGRP
```

Receivers install `D*EX` (candidate default) when the default bit/flag semantics apply—verify with `show ip route`.

## Interface summary default

```text
interface GigabitEthernet0/0
 ip address 10.1.1.1 255.255.255.252
 ip summary-address eigrp 100 0.0.0.0 0.0.0.0
```

Downstream neighbors receive a default; the summarizer installs **Null0** for `0.0.0.0/0` (AD 5). Ensure a more specific default or default route exists for real forwarding—or traffic matching only the summary blackholes on Null0.

## `ip default-network` (legacy)

```text
ip default-network 10.0.0.0
```

Marks a classful major network as candidate default for some IGPs. Do **not** use in greenfield; interviews may still ask—answer “legacy, prefer static redistribute or summary 0/0.”

## Stub interaction

EIGRP stubs may receive a default from the hub (`eigrp stub …` with default leak patterns / `stub receive-only` designs). Confirm stub flags still allow the default you intend (`connected`, `static`, `summary`, `redistributed` options matter).

## Verification

```text
show ip route 0.0.0.0
show ip eigrp topology 0.0.0.0/0
show ip protocols
traceroute 8.8.8.8
! ensure not Null0 blackhole
```

## Risks

- Summary default without a covering route → Null0 discard.
- Redistributing all statics when you meant only default.
- Dual exit defaults without careful metrics → asymmetric or oscillatory exit selection.

## Interview framing

“Inject default by redistributing a static 0/0 with a tight route-map, or by summarizing 0/0 on the edge interface—avoid default-network in modern designs, and watch Null0.”

## Related

- [Redistributing into EIGRP](02_Redistributing_into_EIGRP.md)
- [Summary Blackhole No Null0](../21_Practical_Cases/04_Summary_Blackhole_No_Null0.md)
- [Hierarchical Addressing](../18_Scale_and_Design/01_Hierarchical_Addressing.md)

---
