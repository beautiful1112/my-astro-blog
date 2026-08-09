# ARP and ND Suppression

EVPN **Type-2** routes can carry **MAC-to-IP** bindings. A PE/VTEP can answer local ARP or IPv6 Neighbor Discovery from this control-plane database instead of flooding requests across the overlay.

## Benefits

| Benefit | Detail |
|---|---|
| Less BUM | Fewer ARP/NS floods across VXLAN/MPLS |
| Faster resolution | Local proxy reply from EVPN DB |
| Scale | Large BD / fabric friendlier |

## Mechanism

```text
Host ARP who-has 10.1.1.10
Leaf checks EVPN Type-2 for 10.1.1.10
  if present → ARP reply with advertised MAC (proxy)
  if absent  → flood per BD policy / learn
```

ND suppression follows analogous Neighbor Solicitation handling for IPv6.

## Risks

- **Stale binding** after silent host move → blackhole until mobility/age-out.
- **Poisoned binding** if learning/security weak → traffic diversion.
- Interaction with **anycast gateways** / IRB anycast MAC must be understood.
- Suppression does not fix wrong routing or underlay failures.

Validate binding origin, mobility sequence, aging, duplicate detection, and DAI/IPSG-like features where used.

## Configuration sketch

```text
! Cisco
evpn
  suppress arp
! or under EVI / bridge-domain

! Junos
set protocols evpn suppress-arp
set protocols evpn suppress-ndp
```

## Verification

```text
show evpn arp-suppression
show bgp l2vpn evpn route-type 2
! MAC+IP present
! clear arp; confirm reply without overlay flood (SPAN/capture)
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **MAC mobility** | Must update IP bindings with moves |
| **IRB / anycast GW** | Gateway IPs often specially handled |
| **Type-5** | Prefix routes ≠ host ARP entries |

## Interview framing

“ARP/ND suppression answers neighbor resolution from EVPN Type-2 MAC/IP routes to cut overlay floods; stale or hostile bindings are the main risk—mobility and security features still matter.”

---
