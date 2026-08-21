# SD-WAN design

SD-WAN is **overlay policy + underlay diversity + a controller (change/policy plane)**. It does not delete physics: one Internet circuit is still one failure domain.

## Design pieces (always name all five)

1. **Underlay** — transports that can fail independently (MPLS, DIA1, DIA2, LTE, private). Path survey: entrance, conduit, POP, provider.
2. **Overlay** — encrypted tunnels, segmentation (VPN/VRF/color), app-aware steering (SLA classes).
3. **Controller cluster** — configuration/policy/ZTP; site-diverse; reachable when underlays are sick (or accept change freeze).
4. **Security model** — on-prem firewall hairpin, cloud-delivered security, or split (guest DIA vs PCI to DC).
5. **DIA vs central breakout** — SaaS local exit vs full tunnel for inspection/residency.

```text
Branch
  DIA ──┐
  LTE ──┼── SD-WAN edge ══ overlay ══ regional hub / cloud gateway
  MPLS ─┘         │
                  └─ controller (change plane; not in every packet path)
```

## Real-world — 600 retail stores

**Requirements:** POS SaaS must work if HQ burns; voice MOS on a budget; PCI segmentation; open 20 stores/month.

**Constraints:** Cannot afford dual MPLS everywhere; two WAN engineers; existing DIA per store.

| Decision | Choice | Why |
|---|---|---|
| Underlay | DIA + LTE (active/backup or app-based) | HQ independence; cost |
| Overlay | SD-WAN, VPN for PCI vs guest | Segmentation without stretch |
| Breakout | POS/voice DIA; PCI to regional FW | R1 + compliance |
| Controllers | Cluster in two regions + out-of-band reach | Change plane HA |
| Hub | Dual regional hubs, not one HQ | Avoid hub SPOF |

**Discarded:** “SD-WAN on DIA only” — fails fiber cut RTO for voice. **Discarded:** hairpin all SaaS to HQ — fails HQ-loss requirement.

## Real-world — bank that kept MPLS

**Requirements:** Deterministic latency for market data; regulators want central inspect; branches already dual MPLS.

**Design:** SD-WAN **or** classic on dual MPLS underlay; DIA only for guest; market data pinned to MPLS SLA class; no LTE as primary for that class.

Lesson: SD-WAN is optional when underlay already meets the contract; do not add a controller tax without an outcome (ops velocity, app-steer, DIA).

## Controller fate (write this explicitly)

| Controller unreachable | Typical good design | Bad design |
|---|---|---|
| Existing tunnels | Keep forwarding on last policy | Drop all traffic |
| New site / policy change | Blocked until restore | — |
| ZTP | Blocked | — |

If RTO for *change* is days, controller outage is painful but acceptable. If every brownout kills forwarding, you bought a new SPOF.

## Underlay and routing hygiene

- Prefer **simple underlay** (static/BGP to transports); do not run a second full enterprise IGP only on the overlay without a reason.
- MTU: account for IPsec/GRE overhead; DF/PMTUD failures look like “random app breaks.”
- ECMP/hash: inner vs outer; elephant flows may polarize.

## Security placement patterns

| Pattern | Fits | Risk |
|---|---|---|
| Full tunnel to DC FW | Central policy, easy PCI story | Hub hairpin; HQ loss hurts Internet |
| Local DIA + cloud SWG/SASE | SaaS UX | Residency, decrypt legal, vendor lock |
| Split tunnel by app/VPN | Most enterprises | Policy complexity; shadow IT |

## Migration sketch

1. Dual-run: site gets DIA/LTE, still uses MPLS.
2. Move guest/SaaS classes first; keep voice on MPLS until SLA proves out.
3. Shift remaining; decommission circuit only after success metrics (app probe, ticket rate).
4. Rollback = preference to MPLS TLOC / old default.

## Risks

- Calling single-DIA SD-WAN “HA.”
- Controller in one AZ/region with no OOB.
- Ignoring sovereignty when on-ramping to the wrong cloud region.
- Running OSPF over the overlay *and* a messy underlay with mutual redistribution.

## Interview framing

“SD-WAN is overlay intent on **diverse** underlays. I design controller fate, DIA vs central inspect, and I never pretend one Internet circuit is high availability.”

## Related

- [WAN topologies](02_WAN_Topologies.md)
- [Cloud OnRamp](05_Cloud_OnRamp.md)
- [Centralized versus distributed control](../04_Planes_and_Traffic_Flow/03_Centralized_vs_Distributed_Control.md)
- [Case: SD-WAN without underlay](../19_Practical_Cases/05_SDWAN_Without_Underlay.md)

---
