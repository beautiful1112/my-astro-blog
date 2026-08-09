# Case: Best BGP Route Loses to a Static

## Scenario

BGP shows a valid best path for 203.0.113.0/24. Operators insist “BGP is selected.” Traceroute follows an old floating static with AD 1 (or an IGP route) toward a decommissioned firewall.

## Expected evidence

```text
show bgp ipv4 unicast 203.0.113.0/24
! best path present
show ip route 203.0.113.0
! S 203.0.113.0/24 [1/0] via ...
! not B
```

## Config touchpoints

```text
! Remove stale static, or raise its AD above BGP
ip route 203.0.113.0 255.255.255.0 198.51.100.1 250
```

Check table-maps / VRF import that might also suppress BGP install.

## Verification

`show ip route` shows B/BGP; CEF matches BGP NH; traceroute uses intended exit. See [Best not in RIB](../23_Troubleshooting/06_Best_BGP_Path_Not_in_RIB.md).

## Lesson

RIB installation is a separate stage after BGP best-path. AD and statics win quietly.
## Cross-links

Use the matching troubleshooting or interview note if this case appears in an incident; keep evidence (show output + probe) with the ticket.

---
