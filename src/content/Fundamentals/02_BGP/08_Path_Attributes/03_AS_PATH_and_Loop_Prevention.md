# AS_PATH and Loop Prevention

AS_PATH (type code 2) records autonomous systems through which an advertisement has passed. It is well-known mandatory for applicable UPDATEs and is both a loop-prevention signal and a best-path length metric.

## Segment types

| Segment | Meaning | Length counting (typical) |
|---|---|---|
| **AS_SEQUENCE** | Ordered list of ASNs | Each ASN counts as one hop |
| **AS_SET** | Unordered set from some aggregations | Entire set traditionally counts as **one** |
| Confederation segments | Member-AS path detail inside a confederation | Usually stripped/ignored for external length |

An eBGP speaker normally **prepends its own ASN** (as an AS_SEQUENCE segment) before exporting. iBGP does **not** prepend the local ASN, which is why iBGP needs split-horizon / RR / confederation rules instead.

## Loop prevention on eBGP import

On eBGP receive, a router normally rejects any route whose AS_PATH contains its **own ASN**. That is the fundamental interdomain loop check.

Legitimate exceptions (narrowly scoped):

- [`allowas-in` / `loops`](../12_eBGP_and_iBGP/06_AllowAS_In.md) — accept N occurrences of local ASN (hub-spoke / same-ASN CE designs).
- [`as-override`](../12_eBGP_and_iBGP/07_AS_Override.md) — PE rewrites customer ASN on export so remote same-ASN CEs do not need allowas-in.
- Confederations — member-AS segments are handled specially.

AS_PATH is evidence of the **advertised control-plane path**, not a guarantee of forwarding path, latency, business relationship, or legitimacy of every ASN.

## Configuration: inspecting and matching AS_PATH

### Cisco IOS / IOS XE

```text
ip as-path access-list 10 permit ^65001_
ip as-path access-list 20 deny _23456_
ip as-path access-list 20 permit .*

route-map FROM-CUST permit 10
 match as-path 10
 set local-preference 300

router bgp 65000
 neighbor 192.0.2.1 remote-as 65001
 neighbor 192.0.2.1 route-map FROM-CUST in
```

### Junos

```text
set policy-options as-path CUST-ORIGIN "^65001 .*"
set policy-options policy-statement FROM-CUST term 1 from as-path CUST-ORIGIN
set policy-options policy-statement FROM-CUST term 1 then local-preference 300
set policy-options policy-statement FROM-CUST term 1 then accept
set protocols bgp group CUST import FROM-CUST
```

### FRRouting

```text
bgp as-path access-list CUST-ORIGIN permit ^65001_
route-map FROM-CUST permit 10
 match as-path CUST-ORIGIN
 set local-preference 300
```

## Interactions

| Mechanism | Relationship |
|---|---|
| Prepending | Artificially lengthens AS_SEQUENCE; see [AS-Path Prepending](04_AS_Path_Prepending.md) |
| Four-octet ASNs | Legacy peers may show AS_TRANS 23456; see [Four-Octet Handling](05_Four_Octet_AS_Path_Handling.md) |
| Best-path | Shorter AS_PATH preferred after LOCAL_PREF |
| RPKI / ASPA | Cryptographic/role checks complement—but do not replace—AS_PATH loop detection |
| Aggregation | AS_SET weakens precise path validation |

## Verification

```text
show ip bgp regexp _65000_
show ip bgp neighbors 192.0.2.1 routes
show bgp ipv4 unicast 192.0.2.0/24
! Confirm AS_PATH and whether path is (ineligible) for AS loop
```

Troubleshoot “own AS in path” before relaxing protection: accidental transit, route leaks, confederation misconfig, or intentional allowas-in.

## Risks

- Counting AS_SET as one hop can hide long aggregated paths.
- Regex without anchors (`^` / `$`) accidentally matches mid-path ASNs.
- Over-using allowas-in recreates the loops AS_PATH was meant to stop.
- Treating short AS_PATH as “fast” or “trusted” (policy and RPKI matter more).

## Interview framing

“eBGP prepends local ASN and rejects routes containing it; iBGP does not prepend, so split horizon or RRs prevent loops. AS_PATH length is a selection metric, not a latency or trust guarantee.”

---
