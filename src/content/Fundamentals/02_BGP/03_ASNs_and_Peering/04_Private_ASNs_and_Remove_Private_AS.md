# Private ASNs and remove-private-AS

**Private ASNs** are useful in internal fabrics, lab topologies, customer sites, and some CE-PE designs where global uniqueness is unnecessary. Internet-facing policy must prevent them from leaking into the global AS_PATH, or peers will reject routes and you will pollute path analysis worldwide.

Treat ASN translation/removal as **policy with loop-prevention consequences**, not cosmetic cleanup.

## Why private ASNs appear

| Use case | Typical pattern |
|---|---|
| Enterprise CE toward SP | CE uses private ASN; PE may override or remove |
| Internal staging / labs | Private ASN everywhere; scrub at Internet edge |
| Overlapping customer ASNs | Multiple CEs reuse same private ASN; PE needs AS override / local-AS tools |
| Confederation-like internal structure | Private member ASNs inside a public confederation AS |

See [AS number space](01_AS_Number_Space.md) and eBGP CE-PE toolkit topics in later modules (`local-AS`, `as-override`, SoO).

## remove-private-AS behavior (vendor-sensitive)

Implementations expose modes that roughly mean:

- remove private ASNs only when the path is **all private**;
- remove **all** private occurrences even in mixed paths;
- **replace** private ASNs with the local public ASN;
- combine with `replace-as` / local-AS features.

Mixed public/private paths and AS overrides require explicit lab testing: the wrong mode can hide upstream public ASNs or leave private hops intact.

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 64496
 neighbor 192.0.2.1 remote-as 65000
 address-family ipv4
  neighbor 192.0.2.1 remove-private-as
  ! some platforms: remove-private-as all / replace-as
```

### Junos

```text
set protocols bgp group CUST neighbor 192.0.2.1
set protocols bgp group CUST as-override
# and/or export policy that strips private AS using as-path manipulation
set policy-options policy-statement SCRUB term 1 then as-path-expand last-as
```

Exact Junos scrubbing often uses carefully designed export policy; validate the resulting AS_PATH on a route-server looking glass.

### FRRouting

```text
router bgp 64496
 neighbor 192.0.2.1 remote-as 65000
 address-family ipv4 unicast
  neighbor 192.0.2.1 remove-private-AS
 exit-address-family
```

Always confirm the knob’s exact semantics on the software version in use.

## Interactions

| Mechanism | Interaction |
|---|---|
| AS_PATH loop detection | Removing/replacing ASNs changes what remote ASes consider a loop |
| AS override | Rewrites CE ASN on PE advertisements toward VRF; complementary tool |
| RPKI | Origin ASN in ROA must match the **origin** you actually advertise after scrubbing |
| Confederations | Confed segments are not the same as private-AS removal |

## Verification

```text
show ip bgp neighbors 198.51.100.1 advertised-routes
show bgp ipv4 unicast 203.0.113.0/24
! AS_PATH must show only intended public ASNs toward Internet
show route advertising-protocol bgp 198.51.100.1 detail
```

Lab checks:

1. CE private ASN originates prefix; before scrubbing, Internet peer sees private hop; after, it does not.
2. Mixed path (public + private): test `all` vs default removal modes.
3. Confirm ROA/origin still matches the ASN that remains as origin.

## Risks

- Stripping private ASNs incorrectly → duplicate paths that look distinct or loops that stop looking like loops.
- Relying on peer filters to catch your leaks → fragile and unfriendly.
- AS override without Site-of-Origin controls → re-advertisement loops in VPN topologies.

## Interview framing

“Private ASNs are fine inside a closed domain, but Internet edges must scrub or replace them with tested remove-private-AS/override policy because AS_PATH semantics and RPKI origin both depend on what you actually export.”

---
