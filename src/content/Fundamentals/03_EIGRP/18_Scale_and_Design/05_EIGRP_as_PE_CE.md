# EIGRP as PE-CE

Providers and large enterprises sometimes run **EIGRP between PE and CE** instead of (or in addition to) eBGP. It works, but AD, SoO-like site loop prevention, and operational norms differ from BGP PE-CE.

## Comparison

| Topic | BGP PE-CE | EIGRP PE-CE |
|---|---|---|
| Industry default | Yes | Niche / Cisco-centric |
| Policy expressiveness | Communities, AS-path | Tags, offset-lists, distribute-lists |
| Loop prevention | AS-path, SoO | Topology + tags + VRF SoO options |
| Scalability of policy | Strong | Weaker at Internet scale |
| CE skill familiarity | Broad | Strong in Cisco shops |

## AD considerations

On the CE, EIGRP internal **90** typically beats OSPF **110** and iBGP **200**, but loses to eBGP **20** and static **1**. On the PE, redistributed customer routes become VPNv4 with configured preferences.

Dangerous pattern: CE learns a prefix via EIGRP from PE (maybe external 170) while also having a backdoor OSPF link to another site—backdoor may win unexpectedly.

| CE source | AD | Often wins over |
|---|---|---|
| eBGP from PE | 20 | EIGRP |
| EIGRP internal | 90 | OSPF site |
| EIGRP external | 170 | Loses to OSPF |

Backdoor links need higher OSPF cost or sham-links (MPLS L3VPN) rather than accidental preference.

## Typical PE-CE EIGRP sketch

```text
! CE
router eigrp 100
 network 10.1.0.0 0.0.255.255
 network 192.0.2.0 0.0.0.3
!
! PE VRF
router eigrp 100
 address-family ipv4 vrf CUST-A
  autonomous-system 100
  network 192.0.2.0 0.0.0.3
  topology base
   redistribute bgp 65000 metric 100000 1000 255 1 1500
```

Use per-VRF AS carefully; site-of-origin style extended communities may still apply when redistributing into BGP core.

## When EIGRP PE-CE is justified

- Customer already all-EIGRP and refuses BGP on CE.
- Managed CE with Cisco-only template.
- Lab / legacy VRF.

Prefer BGP PE-CE for multi-vendor CEs and rich policy.

## Verification

```text
show ip eigrp vrf CUST-A neighbors
show ip route vrf CUST-A
show bgp vpnv4 unicast vrf CUST-A
```

## Risks

- Mutual redistribution PE↔CE without tags.
- External AD 170 surprises on CE.
- Assuming AS-path loop semantics exist natively in EIGRP (they do not).

## Interview framing

“EIGRP PE-CE is workable in Cisco VRFs but weaker on policy than BGP; watch AD 90 vs 170 and backdoor site links.”

## Related

- [Administrative Distances](../15_Redistribution_and_AD/01_Administrative_Distances.md)
- [When to Choose EIGRP](06_When_to_Choose_EIGRP.md)
- [Mutual Redistribution Loops](../15_Redistribution_and_AD/06_Mutual_Redistribution_Loops.md)

---
