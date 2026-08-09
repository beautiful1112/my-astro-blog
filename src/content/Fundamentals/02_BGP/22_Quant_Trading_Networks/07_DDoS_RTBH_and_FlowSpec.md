# DDoS Response for Trading Services

Layered response can include provider diversion to scrubbing, anycast absorption, RTBH for a specific attacked destination, FlowSpec for selective filter/rate-limit, and local ACL/policer changes.

## Pre-authorize everything

| Action | Must pre-define |
|---|---|
| Provider diversion | Communities, prefixes, who can trigger |
| RTBH | Blackhole next hop / community; max scope |
| FlowSpec | Allowed actions; rate limits; peer trust |
| Local ACL | Template ACLs; automation expiry |

```text
! Example: accept RTBH community from scrubbing provider only
ip community-list standard RTBH-OK permit 65535:666
route-map FROM-SCRUBBER permit 10
 match community RTBH-OK
 set ip next-hop 192.0.2.66
```

## Trading-specific risk

For an order gateway, an incorrect mitigation can be as damaging as the attack. Use two-person approval or bounded automation for broad rules; maintain an out-of-band control path that does not depend on the attacked VIP.

## Verification

```text
show bgp ipv4 unicast <attacked-prefix>
show ip route <attacked-prefix>
# Confirm blackhole/scrub next hop; probe OOB management still works
```

Automate expiry and retain an audit trail. Cross-link: [RTBH](../16_Security_and_Hardening/07_Remotely_Triggered_Black_Hole.md), [FlowSpec](../20_Advanced_Families/01_BGP_FlowSpec.md).

## Ops note

Record the intended LOCAL_PREF / community class for each VIP in the same repo as the configs so on-call does not reverse-engineer intent from live attributes alone.

---
