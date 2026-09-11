# eBGP versus IGP

Choose eBGP for templateability and policy — not because it forwards faster.

| Decision axis | eBGP | OSPF / IS-IS |
|---|---|---|
| Operating model | Explicit neighbor and policy boundary | Shared link-state domain |
| Automation | ASN, peer-group, prefix policy, and maximum-prefix are easy to generate | Interface-centric templates are also simple; area and metric design matter at scale |
| Addressing | BGP unnumbered can use IPv6 link-local plus extended next hop | IS-IS can operate without interface IPv4; OSPF normally uses numbered or unnumbered links |
| Failure scope | Withdrawals follow explicit adjacencies; policy limits leaks | Topology changes flood through the area or level and trigger SPF |
| Default convergence | Tune fast-external-fallover and BFD | Fast convergence is natural but still requires timer and FIB validation |
| Best fit | Large, repeatable Clos fabrics with strong automation | Teams with deep IGP expertise or compact fabrics |

## Design position

This reference uses eBGP underlay + iBGP EVPN overlay. An IGP underlay is not wrong; it is a different operating model. Compact fabrics or teams with deep IS-IS practice can keep an IGP and still enforce the [underlay contract](01_Underlay_Contract.md).

## Related

- [One eBGP unit per rack](02_eBGP_Per_Rack.md)
- [Choosing an IGP](../../04_CCDE/06_Routing_Protocol_Selection/01_Choosing_an_IGP.md)

---
