# Failure domains

A failure domain is everything that **goes wrong together**. Boxes, links, protocols, power, identity, and change windows can each define one. Good HA starts by **naming** those domains before you buy a second chassis.

## Nesting model

Design nests small domains inside larger ones without stretching the small ones across the large ones.

```text
Closet   <  Building  <  Campus   <  Region   <  Company
 VLAN         summary      IGP         BGP         policy / IdP
 access STP   L3 dist      RR cluster  provider    change freeze
 PDU          UPS zone     power feed  cloud AZ    CI/CD pipeline
```

If identity (IdP / ISE) is one global domain, a perfect campus L3 hierarchy will not save a login outage. Name that domain on the same slide as the routers.

## Domain inventory (draw these on purpose)

| Domain type | Typical unit | What fails together | Shrink with |
|---|---|---|---|
| L2 flood | VLAN / VNI footprint | Broadcast, loop, MAC flap | L3 boundary, prune trunks |
| IGP | Area / process / AS | SPF storm, query scope | Hierarchy, summarization |
| BGP RR | Cluster / RR set | Path visibility, policy | Redundant RR, add-path |
| Controller | Cluster / region | Policy push, ZTP, some fabrics | Site-diverse cluster, last-known forward |
| Power | PDU / room / site | All gear on that feed | Dual PDU, dual site |
| Provider | Circuit / POP / ASN | All paths on that underlay | Diverse entrance + carrier |
| Identity | IdP / RADIUS / cert CA | Auth, NAC, ZTNA | Regional IdP, fail policy |
| Change | Playbook / freeze window | Config blast | Canary, staged push |

## Real-world — “redundant” cores, one domain

**Wanted:** Dual core switches for campus HA.

**Built:** Two chassis, same VLAN set trunked everywhere, same STP domain, same UPS room, same Ansible play applied to both in one job.

**What happened:** Desk-switch loop in Building C → storm across both cores → all buildings. Second core did not create a second L2 domain.

**Repair:** Per-building VLANs, L3 at distribution, BPDU guard, separate change stages for core-A then core-B, document power as its own domain.

## Real-world — WAN “HA” that shared a conduit

**Wanted:** Dual CE routers and dual circuits to “survive fiber cut.”

**Built:** Both fibers in one 24-count from the same manhole; both routers on one PDU.

**What happened:** Backhoe event took both circuits. Redundancy logos survived; packets did not.

**Requirement rewrite:** Diversity is **independent failure domains** (entrance, conduit, POP, power), not port count.

## How to use domains in HLD

1. List the blast radius for each major fault (link, box, power, IdP, controller, provider).
2. Map each business RTO to which domains may fail without violating it.
3. Add redundancy **only** if it splits a domain the RTO cares about.
4. Refuse “temporary” stretches that merge domains without a requirement ID.

```text
Fault: IdP down 4 hours
  Campus L3: still routes
  NAC enforce: login fails  → identity domain owns RTO for “user access”
  Design choice: fail-open guest? cached posture? longer RTO for auth?
```

## Risks

- Two boxes drawn as HA that still share L2, power, fiber, or change.
- Stretching a small domain (VLAN, controller) across sites to “simplify ops.”
- Ignoring non-packet domains: identity, DNS, automation pipeline.
- Counting ECMP paths that hash onto one physical conduit.

## Interview framing

“I list failure domains before I add a second box. Two boxes in one domain are not two domains. I nest closet < building < campus < region and I name power, provider, identity, and change as domains too.”

## Related

- [Fate sharing](04_Fate_Sharing.md)
- [RTO/RPO to HA mapping](02_RTO_RPO_to_HA_Mapping.md)
- [L2 failure domains](../05_Layer2_Design/01_L2_Failure_Domains.md)
- [Case: campus L2 explosion](../19_Practical_Cases/01_Campus_L2_Explosion.md)
- [Case: WAN hub SPOF](../19_Practical_Cases/02_WAN_Hub_SPOF.md)

---
