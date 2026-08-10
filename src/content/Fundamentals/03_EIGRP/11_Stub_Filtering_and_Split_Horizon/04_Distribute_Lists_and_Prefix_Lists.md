# Distribute lists and prefix lists

**Distribute-lists** filter prefixes EIGRP advertises or accepts, using ACLs or prefix-lists (and optionally route-maps on some platforms). They are the primary surgical filter when stub’s coarse categories are not enough.

## Classic patterns

```text
! Outbound: do not advertise 10.99.0.0/16 to a neighbor/interface direction
ip prefix-list NO-LAB deny 10.99.0.0/16
ip prefix-list NO-LAB permit 0.0.0.0/0 le 32

router eigrp 100
 distribute-list prefix NO-LAB out GigabitEthernet0/1

! Inbound: ignore a prefix from a neighbor
distribute-list prefix BLOCK-IN in GigabitEthernet0/1
```

Per-neighbor forms exist depending on code (`distribute-list … out <neighbor>`). Prefer prefix-lists over numbered ACLs for clarity.

## Named mode

Filtering often attaches under topology base / AF with `distribute-list` or route-map topology commands—verify the exact named-mode syntax for your release; af-interface and topology stanzas both appear in Cisco docs.

```text
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  topology base
   distribute-list prefix NO-LAB out GigabitEthernet0/1
  exit-af-topology
```

## Effects on DUAL

- Filtering a path out of the topology can remove an FS you thought you had.
- Inbound filters can cause Active/Query outcomes to differ from physical connectivity.
- Filtered prefixes still consume policy attention—document intent.

## Verification

```text
show ip protocols
show ip eigrp topology
show ip route eigrp
! Confirm prefix absent/present on each side of the filter
```

## Risks

- Asymmetric filters → one-way routing.
- Over-broad `deny` without final `permit` in prefix-list → advertise nothing.
- Using distribute-list instead of stub for query control—filters do not replace stub’s query signaling.

## Interview framing

“Distribute-list = prefix policy in/out; stub = role/query + route-type advertise. Use both: stub for structure, distribute-list for exceptions.”

## Related

- [Offset lists](05_Offset_Lists.md)
- [Route maps with EIGRP](07_Route_Maps_with_EIGRP.md)
- [Stub options](02_Stub_Options.md)

---
