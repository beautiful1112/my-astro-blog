# Interview: allowas-in, as-override, and AIGP

## Question

Explain `allowas-in`, `as-override`, and AIGP. When do you use each, and what are the risks?

## Strong answer

### allowas-in

Relaxes eBGP rejection of routes whose AS_PATH contains the **local** ASN. Used when a legitimate design reintroduces your ASN (same-ASN hub/spoke CE sites, some VPN topologies). Configure the smallest loop count that works. It does **not** replace site-loop prevention—pair with SoO.

Details: [allowas-in](../12_eBGP_and_iBGP/06_AllowAS_In.md).

### as-override

On PE→CE, the PE **rewrites** occurrences of the customer ASN in AS_PATH to the provider ASN so the CE does not see its own ASN and drop inter-site routes. Complementary to allowas-in (rewrite on PE vs accept-on-receive at CE). Prefer one clear design per topology.

Details: [as-override](../12_eBGP_and_iBGP/07_AS_Override.md).

### AIGP (RFC 7311)

Optional non-transitive attribute carrying an **accumulated IGP metric** across trusted BGP boundaries so best-path can prefer lowest interior cost when LOCAL_PREF/AS_PATH are equal. Used in seamless MPLS / confederation-style backbones—not on untrusted Internet eBGP. Does not override LOCAL_PREF.

Details: [AIGP](../08_Path_Attributes/11_AIGP.md).

### Comparison table

| Mechanism | Problem solved | Main risk |
|---|---|---|
| allowas-in | Accept path with own ASN | Real loops if SoO/filters missing |
| as-override | CE would drop own ASN | Hides customer ASN; needs SoO |
| AIGP | Compare interior cost across BGP | Untrusted metrics = steering attack |

### SoO coupling

Enabling allowas-in or as-override without [Site-of-Origin](../18_MPLS_L3VPN/07_Site_of_Origin.md) on dual-homed sites is a classic loop recipe—see [PE-CE toolkit](../18_MPLS_L3VPN/08_PE_CE_AS_Loop_Toolkit.md).

## Follow-ups

- Who should run allowas-in vs as-override in PE-CE?
- Where does AIGP sit in the decision process?
- How do you verify SoO suppression on PE→CE advertisements?

---
