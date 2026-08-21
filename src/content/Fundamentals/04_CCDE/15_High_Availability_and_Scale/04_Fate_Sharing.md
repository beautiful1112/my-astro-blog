# Fate sharing

Fate sharing is **hidden common mode**: two things look redundant on a diagram but fail together because they share power, conduit, control plane, L2, identity, or a change window. CCDE answers that add a second logo without asking “what do they still share?” are weak.

## Classic shared-fate checklist

| Shared thing | Looks like | Dies together when |
|---|---|---|
| Conduit / entrance | Dual circuits | Backhoe, building riser fire |
| POP / provider ASN | Dual DIA | Carrier maintenance |
| PDU / UPS room | Dual PSU servers | Room power event |
| L2 VLAN / VNI stretch | Dual DC | Storm / loop / control event |
| Controller cluster (one AZ) | Dual nodes | AZ loss, bad push |
| IdP / AAA | Dual NAP | Cloud IdP region outage |
| Automation play | Dual devices | One bad playbook hits both |
| Change freeze | Dual sites | Same human error same night |

```text
"Redundant" CE pair
    both uplinks in one 24-fiber
    both powered from one PDU
    both config-pushed in one Ansible play
    both default to same upstream ASN
         → one fate, two logos
```

## Real-world — retail hub pair on one SAN

**Diagram:** Hub-A and Hub-B “HA” for SD-WAN / DMVPN.

**Reality:** Hub-B was a VM on the same SAN and same power room as Hub-A.

**Incident:** Cooling failure → both hubs down → spokes black-holed because they were not stubbed for local DIA.

**Fix domains:** Second physical site, independent storage, spoke default/DIA for SaaS, staged controller/config pushes.

## Real-world — dual firewall, one identity

**Diagram:** Active/standby edge firewalls, dual ISP.

**Incident:** Global IdP outage → VPN and ZTNA failed closed; firewall HA irrelevant.

**Lesson:** Draw the **identity failure domain** on the HA slide. Decide fail-open vs fail-closed against security RTO, in writing.

## Mitigations (design language)

| Goal | Technique |
|---|---|
| Path diversity | Separate entrances, carriers, last-mile media (fiber + LTE) |
| Power diversity | Dual PDU from different UPS/rooms; site diversity for DR |
| Control diversity | Split controller clusters; OOB reachability; last-known forward |
| L2 containment | No casual stretch; L3 DCI default |
| Change diversity | Canary sites; never “all prod in one pipeline job” |
| Identity diversity | Regional IdP, cached sessions, documented degrade mode |

```text
Good dual-hub sketch
  Region-East hub (site E)     Region-West hub (site W)
       | diverse underlays           |
  Spokes: TLOC preference + local DIA for SaaS
  Controllers: cluster members in E and W + OOB
  Change: canary 5% spokes → rest
```

## How to attack a “redundant” diagram in review

1. Trace **physical** path of both “diverse” links.
2. Ask where **power** and **cooling** live.
3. Ask what **control/policy** plane both depend on.
4. Ask whether the **same change** can kill both.
5. Ask what **identity/DNS** must be up for users to notice recovery.

If any answer is “same X,” you have fate sharing—either split X or downgrade the claimed RTO.

## Risks

- Treating MLAG/vPC peers across buildings as independent sites.
- Dual cloud regions that still share one account-wide control plane misconfiguration.
- “Anycast” services pinned to one POP in practice.
- DR drills that only fail a NIC, never a shared conduit or IdP.

## Interview framing

“I hunt shared fate—power, fiber, control, identity, change—before I believe a redundancy diagram. Two devices that share a conduit are one failure domain with extra fans.”

## Related

- [Failure domains](01_Failure_Domains.md)
- [RTO/RPO to HA mapping](02_RTO_RPO_to_HA_Mapping.md)
- [Case: WAN hub SPOF](../19_Practical_Cases/02_WAN_Hub_SPOF.md)
- [Case: DC stretch shared fate](../19_Practical_Cases/06_DC_Stretch_Shared_Fate.md)
- [DCI patterns](../14_Data_Center_and_Cloud/03_DCI_Patterns.md)

---
