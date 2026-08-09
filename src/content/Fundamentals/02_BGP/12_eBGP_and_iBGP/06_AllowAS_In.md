# allowas-in

`allowas-in` (vendor names vary: `loops`, `as-path-loops`, `allowas-in`) relaxes the standard eBGP rule that rejects any route whose AS_PATH contains the local ASN. The receiver accepts a limited number of occurrences of its own ASN instead of dropping the path.

## Why it exists

The classic AS_PATH loop check assumes that seeing your own ASN means the route has circled back through the Internet. That assumption fails in several legitimate designs:

- A hub-and-spoke L3VPN where spoke CE sites use the **same ASN** and routes transit the provider back to another spoke.
- Dual-homed sites that re-advertise a prefix learned from one PE toward another PE in the same customer ASN.
- Some migration or route-server topologies that intentionally reintroduce a path containing the local ASN.

Without `allowas-in`, the spoke PE/CE rejects the remote spoke’s routes even though the data path is intentional and loop-free at the VPN layer (Site-of-Origin or RT design usually provides the real loop prevention).

## Interaction with other mechanisms

| Mechanism | Relationship |
|---|---|
| **as-override** | Complementary PE-CE tool. Override rewrites the customer ASN on export from PE→CE; allowas-in accepts own ASN on import at CE (or PE). Prefer one clear design per topology; using both without documentation is a common source of confusion. |
| **Site-of-Origin (SoO)** | Preferred loop prevention inside a VPN. SoO drops routes that return to the same site; allowas-in only relaxes AS_PATH checking. |
| **remove-private-as** | Orthogonal. Removing private ASNs does not restore a path that was rejected for containing the local public ASN. |
| **RPKI / OTC / roles** | allowas-in does not validate origin or prevent leaks. Keep ordinary prefix and AS-path filters. |

## Configuration patterns

### Cisco IOS / IOS XE (CE or PE neighbor)

```text
router bgp 65001
 address-family ipv4 vrf CUSTOMER-A
  neighbor 192.0.2.1 remote-as 65001
  neighbor 192.0.2.1 activate
  neighbor 192.0.2.1 allowas-in 1
 exit-address-family
```

The optional count (often `1`–`10`) caps how many times the local ASN may appear. Prefer the smallest count that makes the design work.

### Junos

```text
set protocols bgp group CE-SPOKE neighbor 192.0.2.1 family inet unicast loops 1
```

`loops n` means “accept paths that contain this router’s AS up to *n* times.” Semantics are similar but not identical across vendors—verify with a lab path that contains the local ASN once, twice, and more than `n` times.

### FRRouting

```text
router bgp 65001
 address-family ipv4 unicast
  neighbor 192.0.2.1 allowas-in 1
 exit-address-family
```

## Operational verification

1. Without the knob: confirm the route is present in Adj-RIB-In (or soft-reconfig) but rejected for AS loop.
2. Enable with count `1`: route becomes eligible; AS_PATH still shows the local ASN.
3. Inject a path with more local-ASN occurrences than allowed: still rejected.
4. Confirm SoO / RT / prefix filters still discard true site loops.
5. Traceroute or CEF/FIB check that forwarding is not hair-pinning unexpectedly.

```text
show bgp vpnv4 unicast vrf CUSTOMER-A neighbors 192.0.2.1 routes
show bgp vpnv4 unicast vrf CUSTOMER-A 10.10.10.0/24
show ip bgp regexp <local-asn>
```

## Risks

- Disabling or over-raising the loop count can accept leaked or circular Internet paths.
- Combining allowas-in with indiscriminate redistribution into an IGP can create forwarding loops the AS_PATH check used to stop.
- Document *why* the knob is present; treat unexplained allowas-in as a defect during design review.

## Interview framing

State the default rule first (“reject own ASN”), then the exception (“allow N occurrences for same-ASN multihoming / hub-spoke VPN”), and name SoO as the safer VPN-layer complement.

---
