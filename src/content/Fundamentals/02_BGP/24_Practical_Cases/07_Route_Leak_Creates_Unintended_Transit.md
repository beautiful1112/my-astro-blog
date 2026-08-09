# Case: Route Leak Creates Unintended Transit

## Scenario

Customer AS accidentally exports a full table learned from Provider-A toward Provider-B (or an IX peer). Your AS becomes free transit; CPU/FIB pressure rises; third parties send traffic through you.

## Expected evidence

```text
show bgp ipv4 unicast summary
! advertised count explodes toward B
show bgp ipv4 unicast neighbors <B> advertised-routes | count
! includes prefixes whose AS_PATH shows A as upstream, not your customers
```

RPKI may still be Valid—origin can be correct while the path violates valley-free export. OTC/roles would have marked or dropped the leak on supporting peers.

## Config touchpoints

```text
! Outbound to providers/peers: only customer + own prefixes
route-map TO-PROVIDER deny 10
 match community FOREIGN-TRANSIT
route-map TO-PROVIDER permit 20
 match ip address prefix-list CUSTOMER-AND-OWN
```

Enable [BGP Roles / OTC](../17_RPKI_and_Leak_Prevention/08_BGP_Roles_and_OTC.md) where peers support it.

## Verification

Advertised count returns to baseline; external traceroutes no longer traverse you for unrelated pairs. See [Interview: RPKI ≠ leak stop](../25_Interview_Questions/07_RPKI_Does_Not_Stop_Leaks.md).

## Lesson

Export policy and OTC address leaks; ROAs address origin spoofing.
## Cross-links

Use the matching troubleshooting or interview note if this case appears in an incident; keep evidence (show output + probe) with the ticket.

---
