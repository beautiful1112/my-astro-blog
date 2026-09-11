# Stretch only when required

Prefer Layer-3 inter-site connectivity. Use EVPN Multi-Site border gateways to summarize site-local topology and control the few VNIs that must cross the DCI.

Site-local fabrics with a controlled interconnect. Do not stretch every VNI because vMotion or “the same subnet” was easier in the last decade.

## Boundary rule

Use local route reflectors inside each site and eBGP EVPN between border gateways where appropriate. Preserve tenant RT policy, suppress needless site-local routes, and keep L2 extension on an explicit allowlist.

## Related

- [EVPN Multi-Site](02_EVPN_Multi_Site.md)
- [DCI choices](03_DCI_Choices.md)
- [DCI patterns](../../04_CCDE/14_Data_Center_and_Cloud/03_DCI_Patterns.md)

---
