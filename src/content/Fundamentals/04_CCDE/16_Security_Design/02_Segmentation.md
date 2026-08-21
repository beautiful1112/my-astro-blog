# Segmentation

Segmentation is **controlled reachability**: which identities and workloads may talk, on which paths, under which contracts. VLAN, VRF, SGT, zone, tenant, and Kubernetes network policy are different layers with the same intent—pick the layer from **enforcement need** and ops skill, not from fashion.

## Layers and when they fit

| Mechanism | Granularity | Strength | Ops cost | Typical fit |
|---|---|---|---|---|
| VLAN / VN | Subnet-ish | Weak alone (L2/L3 still open inside) | Low | Broadcast domain sizing |
| VRF / VR | Tenant / zone | Strong L3 isolation | Medium | PCI, guest, OT, partner |
| Firewall zones / contracts | Flow / app | Strong allow-list | Medium–high | North-south and seams |
| SGT / group-based | Role / device | Fine east-west if enforced | High (policy plane) | Campus micro-seg |
| Cloud SG / NSG | Instance / tag | Cloud-native | Medium | Public cloud |
| K8s NetworkPolicy | Pod / ns | Workload | Platform team | App platform |

Do **not** run five overlapping overlays with conflicting sources of truth. One primary model + a firewall (or equivalent PEP) at the seam is the default story.

```text
User / device identity
        |
        v
   Group (SGT / ISE / IdP claim)
        |
        v
   VRF or VN  ---- seam ----  Firewall contract
        |
        v
   Optional micro-seg inside (SGT / SG / NetPol)
```

## Real-world — hospital flat “clinical VLAN”

**Wanted:** One big clinical VLAN so imaging carts roam freely.

**What happened:** Compromised IoT pump scanned the VLAN; lateral movement hit nurse workstations. Patching OT was impossible on the vendor timeline.

**Repair:** OT VRF default-deny; only brokered flows to PACS/EHR via FW; clinical user VRF separate; NAC classification into groups; no “temporary” trunk of OT onto user access.

**Requirement rewrite:** Roaming ≠ one flood domain; carts need **reachability to named apps**, not free L2.

## Real-world — merger with five segmentation religions

**Inherited:** VLANs + VRFs + SGTs + cloud SGs + a spreadsheet of “zones,” no single policy owner.

**Symptom:** Same app allowed on FW, denied on SGT, open in cloud SG → audit failure and outages during dual enforce.

**Design:** Choose **VRF + FW contracts** as source of truth for Year-1; SGT only where campus east-west must be fine-grained and the team can operate it; freeze conflicting tags; migrate cloud SGs to same zone taxonomy.

## OT / IoT pattern

OT often **cannot** patch on IT timelines. Segmentation is the control:

- Hard VRF or air-gap-ish VR with default deny.
- Explicit allow to historians / jump hosts only.
- No Internet from OT without a brokered proxy and change control.
- Monitoring: alert on new east-west inside OT, not only north-south.

## Policy hygiene

1. Name zones from **business risk** (PCI, PHI, guest, corp, OT), not from buildings alone.
2. One **source of truth** for allow/deny intent.
3. Enforce at named PEPs; do not rely on “security VLAN” folklore.
4. Document exceptions with expiry; temporary trunk = permanent risk.

## Risks

- VLAN-only “segmentation” with open L3 between VLANs.
- Hairpinning everything to one core FW until teams bypass with local routes.
- SGT without enforcement (classification theater).
- Cloud and on-prem taxonomies that use the same words for different reachability.

## Interview framing

“Segmentation is where packets are not allowed to go. I pick one primary model and a firewall at the seam—not five overlapping overlays. For OT I assume no patch and default-deny.”

## Related

- [Policy enforcement points](04_Policy_Enforcement_Points.md)
- [NAC and zero trust](03_NAC_and_Zero_Trust.md)
- [Regulatory and AI security](05_Regulatory_and_AI_Security.md)
- [VLAN and broadcast design](../05_Layer2_Design/05_VLAN_and_Broadcast_Design.md)
- [Case: campus L2 explosion](../19_Practical_Cases/01_Campus_L2_Explosion.md)

---
