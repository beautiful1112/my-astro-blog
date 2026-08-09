# BGP Multipath and ECMP

Multipath allows multiple sufficiently equivalent BGP paths to install into the **forwarding table**. The router commonly still elects one control-plane **best** path for advertisement and attribute propagation unless ADD-PATH changes what is advertised.

## Eligibility knobs

Implementations can require or relax equality for:

| Attribute / property | Typical multipath concern |
|---|---|
| AS_PATH length / content | Same length; optional multipath-relax |
| Neighboring ASN | eBGP multipath often same AS vs multi-as-relax |
| MED | Usually must match |
| eBGP vs iBGP | Separate eBGP and iBGP multipath features |
| IGP metric to NEXT_HOP | Often must match for iBGP multipath |
| AIGP | Equal AIGP may be required when AIGP is in play ([AIGP](../08_Path_Attributes/11_AIGP.md)) |
| Weight / LOCAL_PREF | Must match |

**dmzlink-bw / link-bandwidth community** can enable unequal-cost balancing on supporting platforms ([Link Bandwidth Community](../11_Policy_and_Traffic_Engineering/11_Link_Bandwidth_Community.md)).

## Data plane vs control plane

- Per-flow ECMP hashing reduces reordering; per-packet ECMP is rare and usually undesirable.
- Polarization: same hash inputs across tiers can map many flows onto one link—vary hash fields or use resilient hashing.
- When a next hop disappears, session resilience and hash remapping determine flow disruption—not BGP best-path theory alone.

Two equal control-plane paths may still have unequal **latency or loss**. Enable ECMP only when physical paths and failure characteristics are understood.

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 maximum-paths 4
 maximum-paths ibgp 4
 bgp bestpath as-path multipath-relax
!
! Optional unequal cost with link-bandwidth community (platform-dependent)
neighbor 192.0.2.1 dmzlink-bw
```

### Junos

```text
set protocols bgp group TRANSIT multipath
set protocols bgp group TRANSIT multihop
set routing-options forwarding-table export PFE-ECMP
set policy-options policy-statement PFE-ECMP then load-balance per-packet
```

(Junos “per-packet” in this export often means per-flow hash to PFE—confirm platform docs.)

### FRRouting

```text
router bgp 65000
 address-family ipv4 unicast
  maximum-paths 4
  maximum-paths ibgp 4
 exit-address-family
```

## Interactions

| Mechanism | Interaction |
|---|---|
| RR path hiding | Multipath cannot use paths the RR never advertised—consider ADD-PATH |
| next-hop-self | All paths may share similar IGP cost after NHS |
| PIC / fast failover | Prefers precomputed backups; related but not identical to ECMP |
| Policy | Slight LP inequality silently disables multipath |

## Verification

```text
show ip bgp 192.0.2.0/24
show ip route 192.0.2.0
show ip cef 192.0.2.0 internal
! Multiple next hops in FIB?
show bgp ipv4 unicast 192.0.2.0/24
```

Lab: equalize attributes; confirm multipath install; raise LP by 1 on one path → single path remains; fail one NH and measure flow remapping.

## Risks

- ECMP across unequal-latency circuits for sync-sensitive flows.
- Multi-AS multipath-relax accepting diverse policies under one hash set.
- Assuming control-plane “multipath” without checking FIB programming.

## Interview framing

“Multipath installs multiple eligible BGP next hops in FIB while one path often remains best for advertisement; equality knobs and hashing—not just maximum-paths—determine real behavior.”

---
