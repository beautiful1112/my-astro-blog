# 27. Follow-up

What to study next after this EIGRP deep dive, open questions to track, and a personal lab backlog template.

## Study next (recommended order)

1. **OSPFv2 deep dive** — areas, LSDB, SPF, stub/NSSA, vs EIGRP query model.  
2. **OSPFv3** — v3 address-family mindset next to EIGRP IPv6 named mode.  
3. **IS-IS** — enterprise/SP IGP; levels, TLVs, traffic engineering adjacency to metrics thinking.  
4. **BGP PE-CE** — replace or coexist with EIGRP at WAN edge; AD and redistribution discipline.  
5. **DMVPN design** — Phase 2/3, NHRP, EIGRP stub/summary/split-horizon patterns from Module 17.

## Open questions list

Track unresolved items while studying (copy freely):

```text
[ ] Classic vs named: remaining feature gaps on our code train?
[ ] Wide metrics: full-domain migration plan and show-command differences?
[ ] SIA timers / SIA-Query behavior on our exact IOS XE version?
[ ] EIGRP in VRF-lite scale limits vs BGP PE-CE?
[ ] HMAC-SHA auth interoperability requirements?
[ ] Variance + CEF behavior on platform X for elephant flows?
[ ] Auto-summary still present anywhere in brownfield?
```

## Personal lab backlog template

```text
Lab idea:
Topology:
Hypothesis:
Pass criteria (show commands):
Failure injection:
Interview takeaway:
Date / result:
```

Suggested backlog seeds:

- Triangle FS local repair vs linear Active (Labs 02–03).  
- Stub on/off Query capture (Lab 04).  
- Dual redistribution tags at two borders (Lab 08).  
- Key rollover without downtime (Lab 09).  
- SIA induced then cured with stub+summary (Lab 10).

## How to keep this library alive

When a production incident teaches something new: add a Practical Case (Module 21), a misconception note (25), or a single interview Q to Module 22—do not let lore stay only in chat history.

---
