# Why MPLS exists

MPLS gives a **scalable way to build services** (L3VPN, L2VPN/EVPN, TE, FRR) on a relatively simple IP underlay **without putting tenant prefixes in the core IGP**.

```text
CE -- PE (VRF + MP-BGP VPN labels) -- P (transport labels only) -- PE -- CE
Core knows next hops + labels — not customer Internet tables
```

Classic L3VPN: **P routers stay BGP-free** for VPN routes. That is the scale story CEOs accidentally buy when they say “we need MPLS.”

## What problem it solves

| Without MPLS-style separation | With MPLS/SR VPN |
|---|---|
| Customer prefixes in core IGP | Core carries loopbacks/links (+ SR/LDP state) |
| Overlapping RFC1918 impossible | Overlap OK in different VRFs |
| TE/FRR awkward | TE/LFA/SR-TE on underlay |
| Per-customer core complexity | PE holds VRFs; P stays dumb |

## Real-world — regional ISP / enterprise WAN

**Need:** 200 VRFs (enterprise customers + internal), overlapping `10.0.0.0/8`, QoS per class, dual PE at each POP.

**Design:**

- IGP (IS-IS/OSPF) + LDP or SR in core
- MP-BGP VPNv4/v6 between PEs (RR for scale)
- RT for any-to-any vs hub-spoke extranet
- Internet in separate VRF/edge; **not** redistributed into customer VRFs casually

**Discarded:** VRFs on a big firewall mesh with statics — does not scale to 200 tenants with overlap.

## Real-world — when **not** to buy MPLS

Two sites, one vendor, need encryption and a few subnets → **IPsec / SD-WAN** is enough. MPLS needs PE skill, label dataplane, and often SP or large enterprise ops. Do not deploy a label core for a vanity diagram.

## Real-world — hospital group “MPLS or SD-WAN?”

**Need:** 40 clinics, EHR in regional DC, radiology imaging bursts, strict HIPAA segmentation, dual DIA at hubs, single circuit at many clinics.

**Options table:**

| Option | Fits | Misses |
|---|---|---|
| Full MPLS L3VPN to every clinic | Clean VRF isolation, TE on owned fiber | Capex/ops; overkill if underlay is Internet |
| SD-WAN over DIA + DC on-ramp | Fast turn-up, app SLA, encryption | Not a free PE/P skill substitute |
| Hybrid: MPLS/private fiber to hubs; SD-WAN spokes | Hub TE + spoke agility | Dual ops models — document seams |

**Pick in this case:** Hybrid or SD-WAN-first unless the org already runs a label core and PE staff. Buy MPLS for **multitenant PE scale and TE on owned underlay**, not because a slide said “carrier-grade.”

## Decision table — buy a label core?

| Signal | Lean MPLS/SR VPN | Lean IPsec/SD-WAN |
|---|---|---|
| Tenant count / overlap | Dozens–hundreds VRFs, RFC1918 clash | Few VRFs, unique addressing |
| Underlay ownership | Owned/dark fiber, need TE/FRR | Mostly Internet DIA |
| Ops skill | PE/P/RR already staffed | Overlay-centric WAN team |
| L2VPN/EVPN services on same core | Strong driver | Rarely justified alone |
| Timeline | Multi-year platform | Months to first site |

## Design checklist

1. Who is PE vs P vs CE? (roles, not chassis count)
2. Where do VPN prefixes live? (PE/RR only)
3. RT topology = service topology (any-to-any / hub-spoke / extranet)
4. Underlay MTU for labels + payload
5. CE-PE routing: BGP/OSPF/static — filtered

## Verification / proof

| Check | Pass signal |
|---|---|
| Core IGP | No customer /32s or Internet table in P RIB |
| Label path | P shows transport labels only; PE holds VPN labels |
| RT import/export | Hub-spoke CEs cannot see peer spokes unless designed |
| MTU | Labeled packet size verified end-to-end (no silent drops) |
| RR HA | Dual RR clusters or diverse placement; withdraw one, VPN control survives |
| Failure drill | Pull one PE uplink; FRR/LFA/SR-TE meets written RTO |

## Risks

- Dumping Internet BGP into the IGP “to make PEs simple.”
- Building MPLS then stretching customer L2 across the core without EVPN discipline.
- Single RR cluster as control SPOF for all VRFs.

## Interview framing

“MPLS is how I keep the core ignorant of tenants and still offer VPNs and TE. If I do not need multitenancy or TE at that scale, I do not buy a label core.”

## Related

- [L3VPN versus L2VPN](02_L3VPN_vs_L2VPN.md)
- [VPN topologies](03_VPN_Topologies.md)
- [Segment routing in design](05_Segment_Routing_in_Design.md)
- [BGP L3VPN library](../../02_BGP/18_MPLS_L3VPN/README.md)

---
