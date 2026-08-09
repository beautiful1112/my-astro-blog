# Interview: Debug Established but No Routes

## Question

BGP is Established but no prefixes are accepted or advertised. How do you debug?

## Strong answer

Walk the chain without clearing sessions:

1. Confirm AFI/SAFI activation and capabilities in OPEN.
2. Check local origination (`network` / redistribute) and Loc-RIB presence.
3. Inspect **advertised-routes** (outbound policy / default-reject).
4. Inspect **received-routes** vs **routes** (inbound policy / RPKI / allowas-in).
5. Consider ORF and conditional advertisement.
6. Soft-refresh after policy fixes—avoid `clear bgp *`.

Name the failing view explicitly. Session up only proves transport + OPEN.

## Follow-ups

- RFC 8212 default deny behavior?
- Soft-reconfig vs refresh?
- VRF vs global table confusion?

## Cross-links

[Established no routes](../23_Troubleshooting/03_Established_but_No_Routes.md), [Zero prefixes case](../24_Practical_Cases/01_Established_Session_Zero_Prefixes.md).

---
