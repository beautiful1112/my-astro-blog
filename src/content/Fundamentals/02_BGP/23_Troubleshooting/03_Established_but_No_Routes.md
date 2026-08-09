# Established but No Routes

The session is up; route exchange or acceptance is not.

## Ordered causes

1. Address-family not activated on one side.
2. Capability negotiated but no NLRI originated (missing `network` / redistribute / aggregate).
3. Inbound or outbound policy default-deny (RFC 8212-style or explicit).
4. ORF negotiating a filter that suppresses everything.
5. Conditional advertisement not triggered.
6. Soft-reconfig vs refresh confusion when “checking received.”
7. Wrong VRF / AFI examined by the operator.

## Evidence

```text
show bgp ipv4 unicast neighbors 192.0.2.1
! Prefix activity counters; families
show bgp ipv4 unicast neighbors 192.0.2.1 received-routes
show bgp ipv4 unicast neighbors 192.0.2.1 routes
show bgp ipv4 unicast neighbors 192.0.2.1 advertised-routes
```

If advertised-routes is empty locally, fix origination/export before blaming the peer. If received-routes is populated but routes is empty, fix import policy (prefix, AS-path, RPKI, first-AS, `allowas-in`).

## Related

- [ORF](../11_Policy_and_Traffic_Engineering/09_ORF.md)
- [Conditional Advertisement](../11_Policy_and_Traffic_Engineering/10_Conditional_Advertisement.md)
- [Interview: Established no routes](../25_Interview_Questions/11_Debug_Established_No_Routes.md)
- [Case: zero prefixes](../24_Practical_Cases/01_Established_Session_Zero_Prefixes.md)

## Decision tree

```text
advertised-routes empty? → origination / outbound policy / conditional / SoO
received empty?          → peer not sending / ORF / wrong AF
received >0, routes=0?   → inbound policy / RPKI / allowas-in / first-AS
routes >0, not best?     → jump to “accepted not best”
```

---
