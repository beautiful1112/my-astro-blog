# Hello interval and Hold time

Hello interval controls how often a router sends EIGRP Hellos on an interface. **Hold time** is advertised in those Hellos and tells peers how long to wait without hearing from this router before declaring the adjacency down. Defaults differ by interface type; WAN/NBMA often uses slower timers.

## Defaults (Cisco common)

| Context | Hello | Hold |
|---|---|---|
| LAN / high bandwidth | **5 s** | **15 s** |
| Low-speed WAN / NBMA style | **60 s** | **180 s** |

Rule of thumb: Hold ≈ 3 × Hello, but the peer enforces **your advertised Hold**, not your Hello. Related: [Hello and Hold](../04_Packets_and_Transport/03_Hello_and_Hold.md), [Neighbor adjacency lifecycle](06_Neighbor_Adjacency_Lifecycle.md).

## Design notes

```text
Faster Hellos  -> faster detection, more control-plane load
Slower Hellos  -> less chatter, slower failure detection
BFD            -> detection independent of Hello (when used)
```

Mismatched pairs:

```text
R1 Hello 5, Hold 15
R2 Hello 60, Hold 15   # R2 may time out R1 if Hellos delayed; also R1 expects frequent R2 Hellos
```

Prefer symmetric designs per link class. On NBMA, prefer correct network type/static neighbors over blindly copying LAN timers.

## Configuration patterns

### Cisco IOS / IOS XE — classic

```text
interface GigabitEthernet0/0
 ip hello-interval eigrp 100 5
 ip hold-time eigrp 100 15
!
interface Serial0/0
 ip hello-interval eigrp 100 60
 ip hold-time eigrp 100 180
```

### Named mode

```text
router eigrp CAMPUS
 address-family ipv4 unicast autonomous-system 100
  af-interface Tunnel0
   hello-interval 60
   hold-time 180
  exit-af-interface
```

## Verification

```text
show ip eigrp interfaces detail
show ip eigrp neighbors
```

Neighbor `Hold` column counts down toward zero between Hellos—healthy neighbors reset it continuously.

Lab checks:

1. LAN defaults; measure detection after hard shut.
2. Set Hold 10 with Hello 5 on peer sending every 5s—borderline under loss.
3. Enable BFD with slow Hellos; compare failover time.

## Risks

- Hello 5 / Hold 15 on lossy microwave without BFD → chronic flaps.
- Changing only Hello, forgetting Hold.
- Assuming both sides use the Hold you configured locally for *them*.

## Interview framing

“LAN EIGRP timers are commonly 5/15 and many WAN/NBMA links 60/180; Hold comes from the neighbor’s Hello, so tune pairs together or use BFD for fast detection.”

---
