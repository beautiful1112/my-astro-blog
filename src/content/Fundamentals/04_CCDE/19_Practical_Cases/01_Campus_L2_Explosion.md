# Case: campus L2 explosion

## Context

National retailer HQ campus: 5 buildings, ~4,000 users, voice + PCI + printers + IoT cameras. Two core switches, distribution per building, access stacks. Prior architecture: **one big user VLAN** trunked “everywhere” so DHCP and firewall rules stayed simple. STP root on core. No BPDU guard on user ports.

## Incident

A loop on a cheap desk switch in Building C (user plugged A into B). Broadcast storm saturated Building C uplinks, then core trunks, then Building A where PCI VLAN had been bridged onto the same trunks “temporarily.” POS in stores (backhauled via HQ) degraded. Wireless controllers flooded. ~2.5 hour business impact.

## R/C/A (reconstructed)

| ID | Type | Text |
|---|---|---|
| R1 | Req | Contain L2 fault to one closet / building |
| R2 | Req | PCI isolated from user flood domain |
| R3 | Req | Voice jitter within MOS target during normal congestion |
| C1 | Constr | Keep existing access hardware this FY |
| C2 | Constr | Change windows nights/weekends only |
| A1 | Assum (bad) | “STP will protect us at campus scale” |

## Options considered

| Option | Description | Verdict |
|---|---|---|
| A | Emergency: prune trunks, split VLANs per building, BPDU guard, storm control | **Immediate** |
| B | Target: L3 to distribution (or L3 access) , summarize, PCI VRF to FW | **Strategic** |
| C | Bigger core chassis + faster STP | Reject — does not shrink flood domain |
| D | Keep one VLAN, add more tools | Reject — same blast radius |

## What “good” looks like after

```text
Building C closets: local VLANs only, BPDU guard
   L3 at dist — summary 10.30.0.0/16 to core
Building A PCI: separate VRF/VLAN, never on user trunks
Voice: own VLAN/VRF, QoS trust at access
Core: dual, few aggregates, no user L2 transit
```

## Second scenario — university dorm “temporary” stretch

**Context:** Campus IT stretched one student VLAN across three dorms so a single DHCP pool and NAC policy “just worked.” STP root still on academic core. Weekend move-in: someone daisy-chained a 5-port switch with a patch that bridged two access ports.

**Event:** Storm stayed inside one building for ~8 minutes (storm-control on uplinks), then flooded the shared VLAN into dorms B and C. Captive portal and wireless APs sharing that VLAN lost CAPWAP. Helpdesk volume spiked; academic research nets on other VLANs stayed up.

**Difference from retail HQ:** Containment tools (storm-control) delayed pain but did **not** meet an independence requirement—three dorms still shared one flood domain.

**Repair path:** Per-dorm VLAN + local DHCP relay; L3 at dorm aggregation; keep one /24 “legacy move week” VLAN deliberately isolated and scheduled for retirement.

## Decision table — where L2 is allowed

| Traffic / asset | Prefer | Stretch across buildings? |
|---|---|---|
| User data / printers | L3 to dist or access | No |
| Voice handsets | Own VLAN, local GW | No (except short migration) |
| PCI / POS | VRF + FW, minimal L2 | Never on user trunks |
| IoT cameras | Closet or building VLAN | No campus-wide trunk |
| Temporary desk switch | Portfast + BPDU guard + storm-control | N/A — treat as untrusted |

## Metrics / proof

| Test | Pass criteria |
|---|---|
| Induce loop in lab closet | Core uplink storm-control counters **do not** rise for other buildings |
| Trunk allow-list audit | PCI VLAN absent from Buildings B–E (`show vlan brief` / allow-lists) |
| Cable unplug vs loop tabletop | Different runbooks; loop never assumes “STP will save us” |
| BPDU guard sample | Errdisable on user port within seconds; no campus STP reconvergence |
| Voice MOS under building storm | Voice VLAN/VRF counters and jitter stay inside MOS budget on other buildings |

- Induce loop in lab closet: core uplink storm-control counters **do not** rise for other buildings.
- `show vlan brief` / trunk allow-lists: PCI VLAN absent from Buildings B–E.
- Tabletop: cable unplug vs loop — different runbooks.

## Migration notes (constraint-aware)

With night/weekend windows only: prune trunks building-by-building; enable BPDU guard on access first; split VLANs before buying new silicon. Document the temporary PCI trunk as a **named risk** until VRF cutover—do not leave it unlabeled.

| Phase | Change | Rollback |
|---|---|---|
| 0 | BPDU guard + storm-control on access | Disable per closet if false positive |
| 1 | Prune trunks; per-building user VLANs | Re-allow list (time-boxed) |
| 2 | L3 at dist; summaries to core | Re-enable L2 transit only with ticket |
| 3 | PCI VRF cutover | Keep dual-path until POS soak done |

## CCDE takeaway

“Simplicity” of one VLAN is simplicity of **one failure domain**. The requirement was containment; the design bought convenience. Fix with **boundaries first**, silicon second.

## Related

- [L2 failure domains](../05_Layer2_Design/01_L2_Failure_Domains.md)
- [VLAN and broadcast design](../05_Layer2_Design/05_VLAN_and_Broadcast_Design.md)
- [L2 versus L3 access](../05_Layer2_Design/04_L2_vs_L3_Access.md)
- [STP and why to minimize L2](../05_Layer2_Design/02_STP_and_Why_to_Minimize_L2.md)

---
