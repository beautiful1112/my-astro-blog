# IPv6 verification

Systematic checks for EIGRP IPv6 adjacencies, topology, RIB install, and Active/SIA—classic and named.

## Neighbor establishment

```text
! Classic
show ipv6 eigrp neighbors
show ipv6 eigrp neighbors detail

! Named
show eigrp address-family ipv6 neighbors
show eigrp address-family ipv6 neighbors detail
```

Confirm: link-local peer address, interface, SRTT/RTO, stub flags, uptime. Empty table → RID, `no shutdown`, af-interface passive, ACL, or missing `ipv6 eigrp` / AF enable.

## Topology and DUAL state

```text
show ipv6 eigrp topology
show ipv6 eigrp topology active
show eigrp address-family ipv6 topology
show eigrp address-family ipv6 topology active
show eigrp address-family ipv6 topology <prefix>/<len>
```

Read FD and `(metric/RD)` the same way as IPv4. Active entries demand query-domain review.

## RIB / FIB

```text
show ipv6 route eigrp
show ipv6 route 2001:DB8:1::/64
show ipv6 cef 2001:DB8:1::/64 detail
```

## Process / RID / stub

```text
show ipv6 protocols
show eigrp protocols
show eigrp address-family ipv6
```

## Failure lab checklist

1. Shut peer link → hold/BFD detect → FS repair or Active.
2. Verify IPv4 and IPv6 both converge (dual-stack).
3. On hub multipoint, confirm v6 spoke routes reflected if SH disabled.
4. Summary Null0 / discard behavior for IPv6 aggregates as implemented.

## Common failures

| Symptom | Likely cause |
|---|---|
| No neighbors | RID missing; process shut; passive AF interface |
| Neighbors up, no routes | Filters; stub receive-only; missing summaries/default |
| SIA on IPv6 only | IPv6 not stubbed/summarized like IPv4 |
| Spoke-spoke fail | Split horizon on hub AF interface |

## Interview framing

“Verify neighbors (link-local), topology FD/RD, Active empty, then ipv6 route/CEF. Always check RID and process no shutdown on classic.”

## Related

- [Router ID requirement](02_Router_ID_Requirement.md)
- [Classic IPv6 router EIGRP](04_Classic_IPv6_Router_EIGRP.md)
- [Stuck in Active](../08_DUAL_and_Feasibility/08_Stuck_in_Active.md)

---
