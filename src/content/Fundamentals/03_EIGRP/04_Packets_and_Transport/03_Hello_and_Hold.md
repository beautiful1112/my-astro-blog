# Hello and Hold

**Hellos** discover and maintain EIGRP neighbors. They advertise the sending router’s **Hold time** and **K-values** (among other TLVs). Hellos are normally sent **unreliably** (no ACK). If Hellos cease, the neighbor is declared down when the **Hold timer** expires.

## Hold is from the neighbor’s Hello

Critical ops rule: the local Hold timer for a neighbor is driven by the **Hold time value carried in that neighbor’s Hellos**, not solely by what you configured as your own Hello interval. Mismatched Hello/Hold pairs across a link are a classic adjacency flap source.

| Network type (Cisco defaults) | Hello | Hold |
|---|---|---|
| LAN / high-speed broadcast | 5 s | 15 s |
| Low-speed WAN / many NBMA | 60 s | 180 s |

Hold is typically **3 × Hello** in default profiles, but configure deliberately on NBMA and high-scale links. Related: [Hello interval and Hold time](../05_Neighbor_Discovery/02_Hello_Interval_and_Hold_Time.md), [Neighbor formation requirements](../05_Neighbor_Discovery/01_Neighbor_Formation_Requirements.md).

## What Hello must agree on

```text
AS number match
K-values match
Primary subnet match (IPv4)
Authentication (if configured)
Compatible AF / parameters
```

Hello also refreshes liveliness; BFD may accelerate detection beyond Hold when configured.

## Configuration patterns

### Cisco IOS / IOS XE — classic interface timers

```text
interface GigabitEthernet0/0
 ip hello-interval eigrp 100 5
 ip hold-time eigrp 100 15
```

WAN example:

```text
interface Serial0/0
 ip hello-interval eigrp 100 60
 ip hold-time eigrp 100 180
```

### Named mode (`af-interface`)

```text
router eigrp CAMPUS
 address-family ipv4 unicast autonomous-system 100
  af-interface GigabitEthernet0/0
   hello-interval 5
   hold-time 15
  exit-af-interface
```

## Verification

```text
show ip eigrp neighbors
show ip eigrp interfaces detail
show interfaces GigabitEthernet0/0 | include DLY|BW
```

Neighbor table shows Hold remaining time counting down—watch it reset on Hello receipt.

Lab checks:

1. Set Hold < peer Hello period → intermittent down.
2. Block Hellos only; wait Hold; confirm neighbor loss.
3. Enable BFD; compare detection time vs Hold.

## Risks

- Tuning Hello without raising Hold proportionately.
- Assuming your configured Hold is what the peer uses for *you*.
- Aggressive timers on lossy NBMA without static neighbors/BFD plan.

## Interview framing

“EIGRP Hellos maintain adjacency unreliably; the Hold time you enforce for a neighbor comes from that neighbor’s Hello—LAN defaults 5/15, many WAN/NBMA 60/180.”

---
