# Failure Detection and BFD

BGP detects peer failure through TCP closure, Hold Timer expiry, or dependent mechanisms. **BFD** (Bidirectional Forwarding Detection) can detect data-path failure much faster and signal BGP to tear down or invalidate the peer.

## Detection options

| Method | Typical scale | Notes |
|---|---|---|
| Hold Timer | Seconds (e.g. 9–180) | Slow but simple |
| Fast external failover / link down | Immediate for directly connected | Misses one-way / remote failures |
| BFD | Tens of ms | Needs careful tuning |
| Carrier-delay / dampening | Delays acting on flaps | Reduces churn |

## BFD with BGP

```text
BFD session tracks peer reachability
   └─> BGP registers as client
         └─> BFD down → BGP session down / NH invalid
```

Multihop BFD follows the routed path to a loopback peer; interpret failures as “path to peer broken,” which may be underlay rather than the peer node itself.

## Configuration patterns

### Cisco

```text
router bgp 65000
 neighbor 192.0.2.2 fall-over bfd
!
bfd-template single-hop EDGE
 interval min-tx 50 min-rx 50 multiplier 3
interface GigabitEthernet0/0
 bfd template EDGE
```

### Junos

```text
set protocols bgp group EBGP neighbor 192.0.2.2 bfd-liveness-detection minimum-interval 50
set protocols bgp group EBGP neighbor 192.0.2.2 bfd-liveness-detection multiplier 3
```

### FRR

```text
router bgp 65000
 neighbor 192.0.2.2 bfd
```

## Tradeoffs

- Aggressive timers cut detection time and **raise false-positive risk** under congestion or CoPP drops.
- Detecting failure ≠ having an alternate path installed—pair with ADD-PATH / PIC / multipath.
- Scale: thousands of BFD sessions need platform validation.

Tune from a **loss budget** and load-test under CPU + link failure, especially for trading edges.

## Interactions

| Mechanism | Relationship |
|---|---|
| **Hold/Keepalive** | BFD usually dominates detection when enabled |
| **GR** | BFD-down often still drops session; GR helps process restart, not link death |
| **PIC** | Fast detection + precomputed backup = useful FRR |
| **iACLs / CoPP** | Must permit BFD (UDP 3784/4784) or sessions flap |

## Verification

```text
show bfd neighbors
show bgp neighbors 192.0.2.2 | include BFD
! shut link; confirm BGP Down reason correlates with BFD
```

## Interview framing

“BFD gives BGP millisecond-scale failure detection; tune against false downs and always combine with an installed backup path—detection alone does not restore traffic.”

---
