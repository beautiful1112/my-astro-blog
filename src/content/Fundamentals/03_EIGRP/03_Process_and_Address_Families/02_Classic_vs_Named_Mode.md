# Classic versus named mode

Cisco supports two configuration styles for EIGRP on IOS/IOS XE: **classic mode** (`router eigrp <as>`) and **named mode** (`router eigrp <NAME>` with address-family stanzas). Both speak the same wire protocol for a given AS and AF; named mode is the modern, multi-AF, VRF-friendly structure and is preferred for new designs.

## Side-by-side

| Aspect | Classic | Named |
|---|---|---|
| Process key | Numeric AS in `router eigrp` | String name + AS under AF |
| IPv4/IPv6 | Separate classic IPv6 EIGRP historically awkward | Clean `address-family ipv4/ipv6` |
| VRF | Limited / older patterns | AF per VRF topology |
| Wide metrics / modern knobs | Partially via legacy | First-class under AF |
| Ops muscle memory | Huge installed base | New builds, CCNP-era |

```text
Classic:  router eigrp 100
Named:    router eigrp NAME
            address-family ipv4 unicast autonomous-system 100
```

Related: [Address families overview](03_Address_Families_Overview.md), [VRF-aware EIGRP](05_VRF_Aware_EIGRP.md).

## Behavioral equivalence (and pitfalls)

- Neighbors form based on **AS**, K-values, subnet, timers—not on whether config is named.
- Mixing classic on one router and named on another **works on the wire** if AS/AF match.
- Migrating config style mid-change window risks human error (wrong network statements, lost stub).
- Some show commands differ: `show ip eigrp …` vs `show eigrp address-family …`.

## Configuration patterns

### Classic IPv4

```text
router eigrp 100
 eigrp router-id 192.0.2.1
 network 10.0.0.0 0.0.255.255
 passive-interface default
 no passive-interface GigabitEthernet0/0
 eigrp stub connected summary
```

### Named IPv4

```text
router eigrp CAMPUS
 !
 address-family ipv4 unicast autonomous-system 100
  eigrp router-id 192.0.2.1
  network 10.0.0.0 0.0.255.255
  af-interface default
   passive-interface
  exit-af-interface
  af-interface GigabitEthernet0/0
   no passive-interface
  exit-af-interface
  eigrp stub connected summary
 exit-address-family
```

Named mode moves many interface knobs under `af-interface`.

## Verification

```text
show ip protocols
show run | section router eigrp
show ip eigrp neighbors
show eigrp address-family ipv4 neighbors
```

Lab: configure classic on R1 and named on R2, same AS; prove adjacency and topology parity for one prefix.

## Risks

- Learning only classic then freezing on named `af-interface` placement.
- Assuming process name must match across routers.
- Partial migration leaving passive/stub only on one style’s stanza.

## Interview framing

“Classic EIGRP keys the process by AS; named mode keys a process name and places AS under address-family—same adjacency rules on the wire, better multi-AF and VRF structure in named.”

---
