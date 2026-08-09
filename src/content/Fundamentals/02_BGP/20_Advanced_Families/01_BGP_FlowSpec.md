# BGP FlowSpec

**FlowSpec** (RFC 8955/8956 and related) distributes **traffic-matching rules and actions** through MP-BGP (SAFI 133/134). It is more selective than destination RTBH and correspondingly easier to break production traffic with a bad rule.

## Match and action

| Match examples | Action examples |
|---|---|
| Src/dst prefix | Discard |
| IP protocol | Rate-limit |
| L4 ports | Redirect to VRF / NH |
| TCP flags / packet length / DSCP | Mark / sample |

Rules install into hardware/forwarding as ordered filters—capacity and precedence vs local ACLs matter.

## Use cases

- Rapid distributed DDoS mitigation.
- Targeted drop of attack signatures closer to edge.
- Temporary redirects to scrubbing centers.

## Safety controls (mandatory mindset)

| Control | Why |
|---|---|
| Strict source authorization | Only SOC/trigger speakers |
| Rule validation | Prefix length, port ranges, rate limits |
| Scoped RTs / peers | Do not blast Internet peers blindly |
| Hardware capacity checks | TCAM exhaustion |
| Precedence analysis | Interaction with ACL/QoS |
| Automatic expiry + audit | Stale rules kill services |

## Configuration sketch

```text
! Cisco (conceptual trigger)
route-map FLOWSPEC permit 10
 set community …
! family ipv4 flowspec on sanitised peers only

router bgp 65000
 address-family ipv4 flowspec
  neighbor 192.0.2.10 activate
```

```text
set protocols bgp group FS family inet flow
set routing-options flow route ATTACK match destination 203.0.113.0/24
set routing-options flow route ATTACK then discard
```

## FlowSpec vs RTBH

| | FlowSpec | RTBH |
|---|---|---|
| Selectivity | High | Destination (usually) |
| Risk | Mis-match drops good traffic widely | Blunter host sacrifice |
| Ops complexity | Higher | Lower |

See [RTBH](../16_Security_and_Hardening/07_Remotely_Triggered_Black_Hole.md).

## Verification

```text
show bgp ipv4 flowspec
show flowspec ipv4 detail
! confirm match counters; stage in lab before prod push
```

## Interview framing

“FlowSpec pushes match/action firewall-like rules over BGP for fast DDoS response; authorize and validate ruthlessly—one bad rule can drop production across the AS.”

---
