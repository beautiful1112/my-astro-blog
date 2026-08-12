# Why MPLS exists

MPLS gives a **scalable way to build services** (VPN, TE, FRR) on a simple IP underlay without putting tenant prefixes in the core IGP.

```text
CE -- PE (VRF + BGP VPN) -- P (labels only) -- PE -- CE
Core knows next hops and labels, not customer tables
```

P routers stay **BGP-free** in classic L3VPN. That is the scale story.

Use MPLS/SR when you need many VRFs, TE, or a common SP/enterprise WAN service. Do not deploy MPLS for two sites that only need IPsec.

## Interview framing

“MPLS is how I keep the core ignorant of tenants and still offer VPNs and TE. If I do not need that, I do not buy a label core.”

---
