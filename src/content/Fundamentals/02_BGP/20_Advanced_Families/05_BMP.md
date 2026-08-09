# BGP Monitoring Protocol

**BMP** (RFC 7854 and extensions) exports BGP monitoring data from routers to **collectors** without making the collector a routing peer that must accept/advertise paths.

## What BMP can provide

| Data | Use |
|---|---|
| Peer up/down events | Session telemetry |
| Statistics | Message/prefix counters |
| Adj-RIB-In pre/post policy | See what peer sent vs accepted |
| Local-RIB views | Best-path visibility |
| Route mirroring | Packet/UPDATE copies where supported |

BMP improves historical analysis of **why** a route changed. It does **not** change routing policy by itself.

## Architecture

```text
Router --BMP station sessions--> Collector (OpenBMP, etc.)
                                   ↓
                              Time-series / UI / alerting
```

Collectors must handle high UPDATE volume and preserve timestamps, peer identity, and AFI/SAFI.

## Configuration sketch

```text
router bgp 65000
 bmp server 1
  host 192.0.2.50 port 5000
  update-source Loopback0
 neighbor 203.0.113.1
  bmp-activate server 1
```

```text
set routing-options bmp station COLLECTOR route-monitoring pre-policy
set routing-options bmp station COLLECTOR connection destination 192.0.2.50
```

## Security

BMP exposes detailed topology and routing information—protect with:

- Mgmt VRF / ACL to collector only;
- Encryption/auth where supported;
- Least-privilege collector access.

## Interactions

| Mechanism | Relationship |
|---|---|
| **Per-family RIBs** | BMP should distinguish families |
| **RPKI / OTC** | Collectors can track validation/leak signals |
| **Looking glass** | Complementary, usually lower volume |

## Verification

```text
show bgp bmp server
show bgp bmp neighbor
! collector UI: peer flaps, prefix appear/disappear
```

## Interview framing

“BMP streams BGP RIBs and events to a collector for observability without being a route reflector peer; protect it—it leaks your full control-plane view.”

---
