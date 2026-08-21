# Overlay, underlay, and fabric

Modern designs separate **reachability** from **services**. Mixing the words hides bad coupling. CCDE expects you to say which layer owns scale, which owns policy, and what fails independently.

## Definitions

| Term | Meaning |
|---|---|
| **Underlay** | IP (or optical) transport that makes overlay endpoints reachable |
| **Overlay** | Tunnels/services: VXLAN, IPsec, GRE, SD-WAN, LISP, MPLS VPN |
| **Fabric** | An integrated system (often underlay + overlay + policy) operated as one product |

A fabric is not automatically better. It is a **product and operational model**. Calling three switches “a fabric” does not create EVPN magic.

```text
Tenant / app  (overlay: VNI, VRF, SD-WAN VPN)
    ^
Transport     (underlay: IGP/BGP, MTU, ECMP, BFD)
    ^
Optics / Ethernet
```

## Design rules

1. Underlay should be **simple and stable**: ECMP, BFD, few prefixes, no tenant policy.
2. Overlay holds **segmentation and services**.
3. MTU, ECMP entropy (inner/outer hashes), and underlay QoS must be designed—or the overlay looks “flaky.”
4. Do not run the same complex IGP in underlay **and** leak tenant state into it.
5. Name who troubleshoots underlay vs overlay at 03:00.

| Layer | Keep here | Keep out |
|---|---|---|
| Underlay | Loopbacks, P2P links, ECMP, BFD | Per-tenant ACLs, huge BGP Internet tables |
| Overlay | VRFs, VNIs, policies, mobility | Fixing underlay MTU with “more tunnels” |
| Fabric ops | Integrated intent, ZTP, assurance | Pretending CLI underlay debt disappeared |

## When not to overlay

A two-router site with one VLAN does not need VXLAN. Overlay complexity needs a requirement: scale, multitenancy, mobility, or automated policy. Underlay-only routed campus is still a valid design.

## Real-world — bank DC EVPN/VXLAN

**Context:** Dual DC, multitenant banking apps, auditors want clear segmentation.

| R / C / A | Statement |
|---|---|
| R | Tenant VRFs isolated; east-west default deny between zones |
| R | Underlay reconvergence ≤ 1 s for leaf link loss (BFD) |
| C | MTU 9100 end-to-end or overlays fragment/blackhole |
| A | “Hashing is fine” — must validate entropy for elephant flows |

```text
Leaf -- (VXLAN VNI / VRF) -- Leaf
  |         overlay              |
  +---- eBGP underlay ECMP ------+
  |         few prefixes         |
Spine                          Spine
```

**Design:** eBGP underlay with leaf loopbacks only; EVPN for tenant routes. Residual: operators must not redistribute tenant prefixes into underlay “to fix reachability.”

## Real-world — retail SD-WAN without underlay design

**Symptom:** Overlay tunnels up; stores randomly blackhole large uploads; voice choppy.

**Root pattern:** Underlay DIA paths with inconsistent MTU, no BFD, and underlay QoS treating IPsec as bulk. Overlay “health” green while data plane suffers.

| Layer | Fix |
|---|---|
| Underlay | MSS clamp / MTU policy, BFD or equivalent probe, mark/queue overlay correctly |
| Overlay | Do not add more VPNs to hide loss |
| Ops | Separate dashboards: underlay loss vs overlay state |

**Lesson:** SD-WAN did not remove underlay design; it **moved** the failure symptoms into tunnel metrics.

## Fabric versus DIY overlay

| Approach | Strength | Weakness |
|---|---|---|
| Vendor fabric | Integrated policy, support model | Lock-in, controller fate |
| DIY underlay + EVPN | Flexible, multi-vendor possible | You own the glue and the blame |
| SD-WAN appliance overlay | Fast branch lifecycle | Underlay quality still yours or the ISP’s |

## Design checklist

1. Can I draw underlay alone and show full endpoint IP reachability for VTEPs/TLOCs?
2. Is tenant state absent from underlay tables?
3. Are MTU and ECMP entropy tested with production-like flows?
4. Is “fabric” a real ops model or a slide label?

## Risks

- Fat underlay IGP full of tenant /32s.
- Overlay on broken MTU or asymmetric underlay.
- Single underlay link painted as “dual fabric” because two VNIs exist.
- Fate-sharing both DCs through one underlay control domain without naming it.

## Interview framing

“Underlay is dumb reachability; overlay is services and policy. I only call it a fabric when the operational model is actually integrated—and I still design the underlay as if the overlay will misbehave.”

## Related

- [Centralized versus distributed control](03_Centralized_vs_Distributed_Control.md)
- [Control, data, and management planes](01_Control_Data_Management_Planes.md)
- [Leaf-spine versus three-tier](../14_Data_Center_and_Cloud/01_Leaf_Spine_vs_Three_Tier.md)
- [Case: SD-WAN without underlay](../19_Practical_Cases/05_SDWAN_Without_Underlay.md)

---
