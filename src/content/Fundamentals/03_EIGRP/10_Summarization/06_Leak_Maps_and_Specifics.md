# Leak maps and specifics

A **leak-map** allows selected **more-specific** prefixes to be advertised out an interface **in addition to** the summary. Used when most traffic should follow the aggregate but certain destinations need explicit path selection or host/site reachability visibility.

## Classic example

```text
route-map LEAK-SITE-A permit 10
 match ip address prefix-list LEAK-A

ip prefix-list LEAK-A permit 10.10.8.0/24

interface GigabitEthernet0/0
 ip summary-address eigrp 100 10.10.0.0 255.255.0.0 leak-map LEAK-SITE-A
```

Upstream receives `10.10.0.0/16` plus `10.10.8.0/24`. Longest match sends traffic for `.8.0/24` to this exit even if another DC advertises the same /16 with a better summary metric.

## Named mode

```text
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  af-interface GigabitEthernet0/0
   summary-address 10.10.0.0/16 leak-map LEAK-SITE-A
  exit-af-interface
```

## Design uses

- Prefer one DC for a specific subnet (anycast-like services, vertical apps).
- Gradually migrate: leak specifics during cutover, then remove.
- Troubleshoot: temporary leak to verify path without removing the summary.

## Costs

Every leaked specific:

- Reappears in upstream topology tables.
- Can be Queried independently → **partially reopens query domain** for that prefix.
- Adds policy complexity—document every leak.

```text
Summarizing router --10.10.0.0/16--> Upstream
R --leak 10.10.8.0/24--> U
```

## Verification

```text
show ip eigrp topology 10.10.8.0/24
show ip eigrp topology 10.10.0.0/16
! On upstream:
show ip route 10.10.8.1
```

## Interview framing

“Leak-map exceptions punch specifics through a summary for longest-match TE. Use sparingly—each leak is a prefix you must operate and query-bound.”

## Related

- [Interface summarization](03_Interface_Summarization.md)
- [Summarization and query reduction](07_Summarization_and_Query_Reduction.md)
- [Route maps with EIGRP](../11_Stub_Filtering_and_Split_Horizon/07_Route_Maps_with_EIGRP.md)

---
