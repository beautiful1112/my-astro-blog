# Offset lists

An **offset-list** adds a metric offset (delay composite impact) to routes matched by an ACL/prefix-list in the in or out direction. It is EIGRP’s classic tool for crude traffic steering without changing interface delay globally.

## Classic configuration

```text
access-list 10 permit 10.10.1.0 0.0.0.255

router eigrp 100
 offset-list 10 in 30000 GigabitEthernet0/0
 offset-list 10 out 30000 GigabitEthernet0/1
```

The numeric offset increases the metric so another path becomes successor. Scope can be interface-limited.

## Named mode

```text
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  topology base
   offset-list 10 in 30000 GigabitEthernet0/0
  exit-af-topology
```

## When to use vs alternatives

| Tool | Use |
|---|---|
| Offset-list | Per-prefix metric bump in/out |
| Interface delay | Affects all prefixes across the link |
| Variance | UCMP sharing, not preference alone |
| Summarization/leak | Change which prefixes exist |

Offset-lists are blunt but explicit in `show` output when you know to look—prefer documenting them in the IP plan.

## Interaction with FS/FC

Raising metric on the successor path can:

- Fail over to another successor if it becomes better.
- Change FD and thus which neighbors pass FC as FS.
- Accidentally eliminate an FS (RD &lt; FD relationship shifts).

Lab after every offset change: topology + FC eligibility.

## Verification

```text
show ip eigrp topology 10.10.1.0/24
show ip protocols
```

## Risks

- Hidden offsets from old troubleshooting sessions.
- Offsets fighting redistribution metrics.
- Large offsets causing black-hole if all paths get offset and a worse AD protocol wins.

## Interview framing

“Offset-list adds metric to matched prefixes in/out—TE with ACL scope. Recheck FD/FS after applying.”

## Related

- [Distribute lists and prefix lists](04_Distribute_Lists_and_Prefix_Lists.md)
- [Successor selection](../08_DUAL_and_Feasibility/04_Successor_Selection.md)
- [Variance unequal cost](../12_Load_Balancing/02_Variance_Unequal_Cost.md)

---
