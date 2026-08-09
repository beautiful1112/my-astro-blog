# Outbound vs Inbound Traffic Engineering

**Outbound** traffic (from your AS to the world) is under stronger local control. **Inbound** traffic (return path into your AS) requires influencing **other** autonomous systems’ decisions—hints, not commands.

## Outbound controls (local)

| Tool | Role |
|---|---|
| LOCAL_PREF / weight | Primary exit preference |
| IGP cost / AIGP | Closest or accumulated interior exit among ties ([AIGP](../08_Path_Attributes/11_AIGP.md)) |
| More-specific internal policy | Steer selected destinations |
| Discard/null for aggregates | Contain failures |

## Inbound controls (remote influence)

| Tool | Role |
|---|---|
| Advertise / suppress more-specifics | Strongest Internet forwarding magnet |
| AS-path prepend | Length hint ([Prepending](../08_Path_Attributes/04_AS_Path_Prepending.md)) |
| Provider communities | Request LP/prepend/region actions |
| MED | Multi-exit hint to a **cooperating** adjacent AS ([MED](../08_Path_Attributes/08_MED.md)) |
| Different announcements per interconnect | Unequal attraction |

Remote LOCAL_PREF remains authoritative. Always validate from external looking glasses and consider the **return path** separately from outbound traceroute.

## Configuration patterns

### Cisco IOS / IOS XE — outbound LP + inbound prepend

```text
route-map FROM-ISP-A permit 10
 set local-preference 200
route-map FROM-ISP-B permit 10
 set local-preference 150
!
route-map TO-ISP-B permit 10
 match ip address prefix-list TE-MORE-SPECIFIC
 set as-path prepend 65000 65000
!
router bgp 65000
 neighbor 192.0.2.1 route-map FROM-ISP-A in
 neighbor 192.0.2.5 route-map FROM-ISP-B in
 neighbor 192.0.2.5 route-map TO-ISP-B out
```

### Junos

```text
set policy-options policy-statement FROM-ISP-A term 1 then local-preference 200
set policy-options policy-statement TO-ISP-B term 1 then as-path-prepend "65000 65000"
```

### Provider community example (conceptual)

```text
! Transit documents: 64496:100 = LP 100, 64496:200 = LP 200
route-map TO-TRANSIT permit 10
 set community 64496:100
```

## Interactions

| Mechanism | Interaction |
|---|---|
| More-specific vs aggregate | Specific wins data plane even if aggregate has better attributes elsewhere |
| Conditional advertisement | Advertise backup only when primary disappears ([Conditional Advertisement](10_Conditional_Advertisement.md)) |
| Multipath | Outbound ECMP may fight intentional single-exit TE |
| RPKI maxLength | TE more-specifics can become Invalid if ROA maxLength is too tight |

## Verification

```text
show ip bgp 203.0.113.0/24
traceroute 203.0.113.10
! Plus external looking glass for inbound path
show ip bgp neighbors 192.0.2.5 advertised-routes
```

## Risks

- Destabilizing global routing to shave local RTT.
- Prepend-only inbound TE with no external proof.
- Advertising more-specifics without capacity or DDoS plan.
- Ignoring asymmetric return paths in trading / stateful firewall designs.

## Interview framing

“Outbound TE is LOCAL_PREF and interior metrics; inbound TE is more-specifics, prepends, MED, and provider communities—always verify remotely because the other AS still decides.”

---
