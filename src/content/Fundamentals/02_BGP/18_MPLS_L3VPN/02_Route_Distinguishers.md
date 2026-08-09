# Route Distinguishers in L3VPN

A **Route Distinguisher (RD)** is an 8-octet value prepended to a customer prefix to form VPNv4/VPNv6 NLRI. Its job is **uniqueness in the provider BGP table**, not VPN membership.

## Why RD exists

Two customers may both use `10.0.0.0/8`. Without RD, those NLRIs collide in a single BGP table. With RD:

```text
65000:1:10.0.0.0/8   (Customer A)
65000:2:10.0.0.0/8   (Customer B)
```

They are distinct VPN routes even if RTs later import both into different VRFs.

## Formats (Type 0 / 1 / 2)

| Type | Administrator | Assigned number | Common use |
|---|---|---|---|
| 0 | 2-byte ASN | 4-byte value | `ASN:nn` |
| 1 | 4-byte IP | 2-byte value | `IP:nn` |
| 2 | 4-byte ASN | 2-byte value | large ASN spaces |

Notation like `65000:100` or `192.0.2.1:1` is typical in configs.

## RD vs RT vs SoO

| Attribute | Purpose |
|---|---|
| **RD** | Make NLRI unique |
| **RT** | Which VRFs import/export |
| **SoO** | Site loop prevention—[07](07_Site_of_Origin.md) |

Changing RD changes the NLRI identity (withdraws/re-advertises as a new route). Changing RT changes membership without renaming the prefix identity the same way.

## Per-VRF vs per-PE RD designs

| Design | Pros | Cons |
|---|---|---|
| Unique RD per VRF globally | Simple mental model | — |
| Unique RD per PE per VRF | Aids multipath / path diversity | More RDs to manage |
| Shared RD across sites | Fewer values | Can hide multipath distinctions |

Many platforms recommend **unique RD per PE-VRF** so the same prefix from two PEs appears as two NLRIs (helpful with ADD-PATH / multipath).

## Configuration

```text
! Cisco
vrf definition CUST
 rd 65000:10

! Junos
set routing-instances CUST route-distinguisher 65000:10
```

## Verification

```text
show bgp vpnv4 unicast rd 65000:10
show bgp vpnv4 unicast vrf CUST 10.0.0.0
! RD displayed with NLRI
```

## Risks

- Accidental RD reuse across unrelated VRFs collapses distinct customer spaces into one NLRI namespace.
- RD renumbering is disruptive—treat like a migration.
- Operators confusing RD with RT misconfigure “VPN membership.”

## Interview framing

“The RD only uniquifies VPN prefixes in the SP BGP table; Route Targets—not RDs—decide which VRFs import a route.”

---
