# Interface summarization

EIGRP manual summarization is applied **per interface** (outbound): the router advertises the summary out that interface instead of (or in addition to, with leak-maps) the matching component prefixes.

## Classic IOS / IOS XE

```text
interface GigabitEthernet0/0
 ip address 192.0.2.1 255.255.255.252
 ip summary-address eigrp 100 10.10.0.0 255.255.0.0
```

AS number in the command must match the EIGRP process. Optional leak-map:

```text
ip summary-address eigrp 100 10.10.0.0 255.255.0.0 leak-map LEAK-SITE-A
```

## Named mode

Summaries live under **af-interface**:

```text
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  af-interface GigabitEthernet0/0
   summary-address 10.10.0.0/16
  exit-af-interface
 exit-address-family
```

## Behavioral notes

- Summary is sent **out the configured interface** to neighbors on that link.
- Components are suppressed out that interface (unless leaked).
- Creating a summary installs a **Null0** route for the aggregate locally (next lesson).
- Summary metric is derived from component metrics (metric lesson).

```text
Components / 10.10.1.0/24 … --> Router
R --summary 10.10.0.0/16--> Upstream neighbor
R --Null0 for 10.10.0.0/16--> Local RIB
```

## Verification

```text
show ip route 10.10.0.0
show ip eigrp topology 10.10.0.0/16
show ip protocols
! Named:
show eigrp address-family ipv4 interfaces
```

Confirm upstream sees the aggregate, not the flood of /24s; confirm local Null0.

## Risks

- Summarizing on the wrong interface (toward access instead of toward core).
- Mismatched masks between redundant DCs advertising overlapping aggregates.
- Forgetting both directions on dual uplinks.

## Interview framing

“Manual summary is per-interface outbound; named mode uses af-interface summary-address. Always pair with Null0 awareness and a planned mask.”

## Related

- [Null0 discard route](04_Null0_Discard_Route.md)
- [Leak maps and specifics](06_Leak_Maps_and_Specifics.md)
- [AF interface configuration](../13_Named_Mode_and_Configuration/03_AF_Interface_Configuration.md)

---
