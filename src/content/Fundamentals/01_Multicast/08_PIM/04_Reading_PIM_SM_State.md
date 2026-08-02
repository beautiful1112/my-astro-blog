# Reading PIM-SM state

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

```text
(*, 239.10.10.10)
  RPF toward RP: Core1
  OIL: Receiver-VLAN

(192.0.2.10, 239.10.10.10)
  RPF toward source: Edge1
  OIL: Receiver-VLAN
  SPT bit: set
```

Read state in this order:

1. Is the group treated as ASM or SSM?
2. Is RPF toward the RP or source?
3. Is the IIF/upstream neighbor correct?
4. Why is each OIF present: local membership, downstream Join, or static state?
5. Are input/output counters increasing and RPF failures zero?
6. Is forwarding programmed in hardware?

