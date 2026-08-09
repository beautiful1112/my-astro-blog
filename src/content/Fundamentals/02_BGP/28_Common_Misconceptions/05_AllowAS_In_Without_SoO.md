# Misconception: allowas-in or as-override Alone Is Enough

## The myth

“Turning on allowas-in (or as-override) fixes same-ASN PE-CE designs; nothing else is needed.”

## Why it is wrong

Those tools only relax or rewrite **AS_PATH loop detection** so inter-site routes can be accepted. They do not stop a dual-homed site from learning its **own** prefixes back through the VPN backbone. Without [SoO](../18_MPLS_L3VPN/07_Site_of_Origin.md) (or equivalent site filtering), the CE/IGP may prefer the hairpinned VPN path and loop or blackhole.

Using both allowas-in and as-override without a documented design also confuses operations and incident response.

## Verification snippet

```text
show bgp vpnv4 unicast vrf CUST neighbors <CE> advertised-routes
! Site-local prefixes must be absent when SoO is correct
show bgp vpnv4 unicast vrf CUST <prefix>
! Extended Community: SoO:...
```

## Correct habit

Treat PE-CE as a toolkit: pick allowas-in **or** as-override intentionally, always add SoO on dual-homed sites, and verify PE→CE advertised-routes lack site-local prefixes—see [PE-CE toolkit](../18_MPLS_L3VPN/08_PE_CE_AS_Loop_Toolkit.md) and [memory card](../27_Memorization/05_Advanced_PECE_and_AIGP_Memory_Card.md).

---
