# BGP Confederations

RFC 5065 divides one **public AS** into multiple **member ASes**. Inside the confederation, member-AS borders behave somewhat like eBGP (NEW_AS_PATH segment types, MED/LOCAL_PREF handling nuances), while to the outside world the network still looks like a **single AS**.

## Why confederations exist

Large ASes historically needed to escape iBGP full-mesh scale before route reflection was ubiquitous. Confederations:

- Partition administration and policy between sub-ASes.
- Replace a global iBGP mesh with smaller meshes (or RRs) per member AS.
- Preserve a single external ASN for peering and IRR objects.

Today most greenfield designs prefer **route reflection**; confederations remain in migrations, mergers, and some SP backbones.

## AS_PATH segment types

| Segment | Meaning |
|---|---|
| AS_SEQUENCE / AS_SET | Ordinary external path info |
| AS_CONFED_SEQUENCE / AS_CONFED_SET | Member-AS path inside the confederation |

When advertising to a **true external** eBGP peer, confederation segment types are stripped so the neighbor sees only the public ASN (plus any real external path).

Loop prevention inside the confederation uses confederation segments similarly to how ordinary AS_PATH prevents eBGP loops.

## Session types

```text
Member-AS 65001 ----(confed-eBGP)---- Member-AS 65002
     |                                      |
   iBGP mesh/RR                          iBGP mesh/RR
     |                                      |
External eBGP to Internet still uses public AS 64500
```

Confederation eBGP peers often exchange LOCAL_PREF and may not change NEXT_HOP the same way as classic Internet eBGP—**verify platform defaults**.

## Configuration patterns

### Cisco IOS

```text
router bgp 65001
 bgp confederation identifier 64500
 bgp confederation peers 65002 65003
 neighbor 192.0.2.2 remote-as 65002
 neighbor 203.0.113.1 remote-as 64496
```

`confederation identifier` is the public ASN. `confederation peers` lists member ASNs.

### Junos

```text
set routing-options confederation 64500 members [ 65001 65002 65003 ]
set protocols bgp group MEMBER neighbor 192.0.2.2 peer-as 65002
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **Route reflection** | Can run inside each member AS; do not confuse CLUSTER_LIST with confed segments |
| **as-override / allowas-in** | Different problem space (PE-CE VPN); see [PE-CE toolkit](../18_MPLS_L3VPN/08_PE_CE_AS_Loop_Toolkit.md) |
| **remove-private-as** | Member ASNs are often private; stripping rules at the public edge must be deliberate |
| **AIGP** | Useful to accumulate IGP cost across member-AS borders—[AIGP](../08_Path_Attributes/11_AIGP.md) |
| **RPKI / OTC** | External validation still uses the public ASN as origin where applicable |

## Verification

```text
show bgp ipv4 unicast <prefix>
! AS_PATH may show (65002) confederation segments internally
show bgp neighbors 203.0.113.1 advertised-routes
! External peer must NOT see member ASNs
```

From an external looking-glass, the network must appear as ASN `64500` only.

## Costs and design rules

- Operators misread AS_PATH containing confederation segments during incidents.
- Migration between confederation and RR-only designs is high-touch.
- Prefer one scaling mechanism unless merger constraints force both.
- Document which knobs treat confed-eBGP like iBGP (NEXT_HOP, LOCAL_PREF retention).

## Interview framing

“A confederation splits one public AS into member ASes with special AS_PATH segments for internal loop control; externally it still looks like one ASN—useful for scale and admin split, but operationally heavier than route reflection.”

---
