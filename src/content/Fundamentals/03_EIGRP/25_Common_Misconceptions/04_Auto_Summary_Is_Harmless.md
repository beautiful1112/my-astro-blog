# Misconception: Auto-Summary Is Harmless

## The myth

“Auto-summary is fine—we only use /24s inside classful major nets.”

## Why it is wrong

Auto-summary reintroduces **classful aggregation** behavior: discontinuous subnets, surprising major-net summaries, and blackholes when components are not contiguous. Modern IOS defaults moved toward **no auto-summary** for good reason. Explicit interface summaries with Null0 are intentional and visible; auto-summary is a footgun.

## Counterexample (discontiguous)

```text
Site-A: 172.16.1.0/24 ---- R1 ==== (10.0.0.0/8 transit) ==== R2 ---- Site-B: 172.16.2.0/24
```

With auto-summary, R1 and R2 may each advertise **172.16.0.0/16** toward the transit. Traffic for 172.16.2.0 attracted to R1 blackholes (or vice versa). Same classful major net, discontinuous geography—auto-summary lies.

Numeric sketch: Core has two equal 172.16.0.0/16 via R1 and R2; longest match fails because specifics never left the sites.

## Ops symptom table

| Symptom | Check |
|---------|--------|
| Reachability to “other half” of major net fails | Discontiguous + auto-summary |
| Unexpected /8 /16 in topology | `show ip protocols` summarization state |
| Works after `no auto-summary` + specifics | Confirms myth |
| Intentional aggregate needed | Use interface summary + Null0 AD 5 |

## Correct habit

`no auto-summary` everywhere; summarize deliberately at AF/interface boundaries; verify Null0 discard routes.

## Related

- [Auto-summary legacy](../10_Summarization/02_Auto_Summary_Legacy.md)
- [Interface summarization](../10_Summarization/03_Interface_Summarization.md)
- [Null0 discard route](../10_Summarization/04_Null0_Discard_Route.md)
- [Lab: Interface summarization Null0](../23_Labs/05_Interface_Summarization_Null0.md)

---
