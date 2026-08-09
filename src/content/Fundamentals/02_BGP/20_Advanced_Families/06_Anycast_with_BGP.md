# Anycast with BGP

**Anycast** advertises the **same prefix** from multiple locations. Ordinary BGP best-path and IGP hot-potato behavior steer users toward a “near” instance according to policy and topology—not necessarily geographic distance.

## Design requirements

| Requirement | Why |
|---|---|
| Identical, accepted prefix length at each site | Upstream filters / RPKI maxLength |
| Health checks withdraw or deprefer sick sites | Avoid blackholing |
| App state model | Stateless OK; sticky TCP may break on shift |
| Capacity & DDoS plan | Traffic shifts suddenly on withdraw |
| Consistent origin ASN / ROAs | Avoid Invalid |

## Control patterns

```text
Site healthy  → advertise anycast /24 (or /32 DNS/NTP style)
Site sick     → withdraw OR advertise with lower LOCAL_PREF / community
```

Prefer automated, tested health withdrawal over manual NO-EXPORT hacks without monitoring.

## Convergence caveat

During failure, flows can **move mid-session** to another site. DNS anycast, HTTP anycast, and DNS recursive services must tolerate that; some financial apps cannot.

## RPKI / filter notes

- ROA must authorize the anycast length from each origin ASN (or use one ASN consistently).
- Too-specific anycast may be filtered by peers—coordinate minimum lengths.

## Interactions

| Mechanism | Relationship |
|---|---|
| **PIC / diversity** | Faster shift between instances |
| **Graceful shutdown** | Drain a site before maintenance |
| **RTBH** | Can conflict if anycast IP is blackholed globally |
| **EVPN anycast GW** | Related IRB pattern inside fabrics |

## Verification

```text
show bgp ipv4 unicast <anycast-prefix>
! multiple geographically diverse paths from outside view
mtr / traceroute from multiple probes
! withdraw one site — traffic moves, loss within budget
```

## Interview framing

“Anycast is the same prefix from many POPs; BGP steers by routing proximity, health must withdraw bad sites, and stateful apps must tolerate mid-flow moves.”

## Configuration sketch

```text
! each POP
router bgp 64500
 network 203.0.113.0 mask 255.255.255.0
 neighbor 192.0.2.1 route-map ANYCAST-OUT out
route-map ANYCAST-OUT permit 10
 match ip address prefix-list ANYCAST
 ! set community for traffic-eng / graceful shutdown when draining
```

Health checker withdraws `network` or applies GRACEFUL_SHUTDOWN community before maintenance.

## Failure drill

Withdraw POP-A while measuring client loss and which POP absorbs traffic; confirm capacity headroom and DNS TTLs if DNS is also anycasted.

---
