# Overlay, underlay, and fabric

Modern designs separate **reachability** from **services**. Mixing the words hides bad coupling.

## Definitions

| Term | Meaning |
|---|---|
| **Underlay** | IP (or optical) transport that makes overlay endpoints reachable |
| **Overlay** | Tunnels/services: VXLAN, IPsec, GRE, SD-WAN, LISP, MPLS VPN |
| **Fabric** | An integrated system (often underlay + overlay + policy) operated as one |

A fabric is not automatically better. It is a **product and operational model**.

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
3. MTU, ECMP entropy (inner/outer hashes), and underlay QoS must be designed—or the overlay will look “flaky.”
4. Do not run the same complex IGP in underlay *and* leak tenant state into it.

## When not to overlay

A two-router site with one VLAN does not need VXLAN. Overlay complexity needs a requirement: scale, multitenancy, mobility, or automated policy.

## Interview framing

“Underlay is dumb reachability; overlay is services and policy. I only call it a fabric when the operational model is actually integrated—and I still design the underlay as if the overlay will misbehave.”

---
