# Policy enforcement points

Intent without an enforcement point is a slide. Name **where** packets are actually allowed or dropped: access switch, WLC, firewall, SD-WAN edge, ZTNA broker, cloud security group, SASE POP. Signaling (RADIUS, pxGrid, SXP, API) moves policy; it does **not** drop traffic by itself.

## PEP map

```text
Identity / policy store (IdP, ISE, CMDB tags)
              |
     +--------+--------+
     |                 |
 Edge PEP           WAN / cloud PEP
 (switch, WLC)      (FW, SD-WAN, ZTNA, SASE, SG)
     |                 |
  dACL/SGT/VLAN     contract / ZTNA App / NSG
```

| PEP | Enforces | Good for | Weak if alone |
|---|---|---|---|
| Access switch | AuthZ, VLAN, dACL, SGT | Campus admission | No internet/SaaS control |
| WLC / AP | Same for wireless | SSID policy | Wired bypass |
| Firewall | L3–L7 contracts | Seams, PCI, OT | Hairpin / bypass routes |
| SD-WAN edge | VPN/VRF, app steer, local DIA ACL | Branch intent | Underlay still open |
| ZTNA broker | User-to-app | Remote / least privilege | Campus lateral if flat |
| Cloud SG / SASE | Cloud / web path | SaaS and IaaS | On-prem east-west |

## Real-world — “one big core firewall”

**Intent:** All security at the data center FW.

**What happened:** Branches got DIA for SaaS; shadow paths bypassed the FW; guest and corp mixed on Wi-Fi; audit found no PEP on those paths.

**Repair:** Explicit PEP per path class—campus edge for admission, regional FW for PCI, SASE/SWG for DIA SaaS, default-deny OT VRF. Draw the bypasses first.

## Real-world — too many PEPs, no source of truth

**Built:** ISE SGTs + FW objects + SD-WAN ACLs + cloud SGs, each edited by a different team.

**Symptom:** Change in one place did not propagate; outages during “tighten” projects; duplicate and conflicting allows.

**Design rule:** One **intent** store (or clear master/slave sync); PEPs are projectors of that intent. Prefer fewer PEP *types* with clear ownership over every box having a unique ACL language.

## Signaling vs enforcement

| Protocol / bus | Role | Still need |
|---|---|---|
| RADIUS / TACACS | Auth result to edge | Switch/WLC applies VLAN/ACL |
| pxGrid / SXP | Share IP↔SGT / context | Switch or FW enforcement |
| Controller API | Push policy | Device accepts and programs TCAM |
| DNS / IdP claims | Input to ZTNA | Broker enforces session |

If the exam answer stops at “we use pxGrid,” ask: **which device drops the packet?**

## Placement patterns

| Pattern | Description | Risk to name |
|---|---|---|
| Edge-heavy | NAC + micro-seg at access | Ops scale; TCAM |
| Seam-heavy | VRF + FW at zone borders | Coarse; hairpin |
| Broker-heavy | ZTNA/SASE for users-to-apps | Campus trust remains |
| Hybrid (common) | Edge admission + seam FW + broker for remote | Sync of taxonomies |

```text
Bad:  Intent slide → (no PEP named) → "secure by design"
Good: Intent → PEP list → fail mode → telemetry that proves drop/allow
```

## Design checklist

1. List user/app paths (campus, branch, remote, cloud).
2. For each path, name the **PEP** that can deny.
3. Name the **source of truth** and sync lag.
4. Document IdP/controller down behavior per PEP.
5. Prove with logs/counters that denies happen where claimed.

## Risks

- Policy only in a CMDB spreadsheet.
- Core FW as the only PEP while DIA and L2 bypass exist.
- Signaling mistaken for enforcement.
- Duplicate PEPs that disagree under failure.

## Interview framing

“I list enforcement points and one source of truth. Signaling protocols do not drop packets; PEPs do. If a path has no PEP, it is not a controlled path.”

## Related

- [Segmentation](02_Segmentation.md)
- [NAC and zero trust](03_NAC_and_Zero_Trust.md)
- [Policy and orchestration planes](../04_Planes_and_Traffic_Flow/05_Policy_and_Orchestration_Planes.md)
- [Controller-based design](../17_Automation_and_Observability/01_Controller_Based_Design.md)
- [Visibility, observability, assurance](../17_Automation_and_Observability/04_Visibility_Observability_Assurance.md)

---
