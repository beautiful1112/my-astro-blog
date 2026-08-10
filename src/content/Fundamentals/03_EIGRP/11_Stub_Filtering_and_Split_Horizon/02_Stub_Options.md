# Stub options

`eigrp stub` takes optional keywords controlling **which prefix classes** the stub advertises. Omitting options defaults to **connected** and **summary** on classic IOS (verify platform). `receive-only` advertises nothing.

## Option reference

| Option | Advertises |
|---|---|
| **connected** | Connected routes redistributed into EIGRP / covered by network statements as appropriate |
| **summary** | Configured summary routes |
| **static** | Static routes redistributed into EIGRP |
| **redistributed** | Routes redistributed from other protocols |
| **receive-only** | Advertise no routes (spoke only receives) |

Combinations are common:

```text
eigrp stub connected summary
eigrp stub connected summary static
eigrp stub receive-only
```

## Leak-map with stub

Some platforms allow a **leak-map** with stub to advertise a controlled subset of otherwise suppressed routes—use when a spoke must inject one exception prefix without becoming a full transit router. Treat as documented exception policy.

```text
eigrp stub connected summary leak-map SPOKE-EXCEPTIONS
```

## Named mode

```text
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  eigrp stub connected summary static
 exit-address-family
```

## Choosing options

| Spoke needs to inject… | Options |
|---|---|
| Local user subnets only | `connected` (+ `summary` if summarizing locally) |
| Null0/default static into EIGRP | add `static` (and redistribute static) |
| BGP/OSPF edge at spoke | add `redistributed` carefully |
| Pure receive of default | `receive-only` + hub default/summary |

## Risks

- `receive-only` without a default from hub → total black hole.
- `redistributed` on stub can accidentally inject a large table and surprise the hub.
- Wrong assumption that stub alone filters inbound routes—stub primarily constrains **what the stub advertises** and query roles; use distribute-lists for inbound control.

## Interview framing

“List the five option classes; default connected+summary; receive-only is silent advertise; leak-map is the exception valve.”

## Related

- [EIGRP stub overview](01_EIGRP_Stub_Overview.md)
- [Stub in hub and spoke](03_Stub_in_Hub_and_Spoke.md)
- [Leak maps and specifics](../10_Summarization/06_Leak_Maps_and_Specifics.md)

---
