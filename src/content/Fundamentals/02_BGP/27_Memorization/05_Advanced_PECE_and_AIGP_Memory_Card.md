# allowas-in, as-override, AIGP, and SoO Memory Card

Memorize definitions, direction of action, and mandatory pairings.

## Definitions

| Feature | One-line definition |
|---|---|
| **allowas-in** | Receiver accepts AS_PATH containing its own ASN up to N times |
| **as-override** | PE rewrites customer ASN to provider ASN in AS_PATH toward CE |
| **SoO** | Per-site extended community; PE suppresses matching routes to that site |
| **AIGP** | Accumulated IGP metric attribute (RFC 7311); lower preferred |

## Who acts where

```text
allowas-in     → configured on the speaker that would otherwise drop (often CE or PE import)
as-override    → configured on PE toward CE (export rewrite)
SoO            → set on routes from site; matched on PE→CE export suppress
AIGP           → enabled in trusted backbone; accumulates across BGP hops
```

## Pairing rules

- Dual-homed / same-ASN VPN sites: **(allowas-in ∨ as-override) ∧ SoO**.
- Never enable allowas-in or as-override on Internet edges “to make routes appear.”
- AIGP never replaces LOCAL_PREF; keep LP equal when AIGP should decide.
- Do not send AIGP to untrusted eBGP peers (non-transitive + policy).

## Flash Q&A

1. CE drops inter-site routes with its own ASN in path—two fixes? → as-override on PE **or** allowas-in on CE.
2. After override, CE learns its own prefix via PE—missing what? → SoO.
3. AIGP vs MED? → AIGP accumulates interior cost across trusted domains; MED is neighbor-AS exit hint.
4. AIGP on public Internet? → No.

## Cross-links

- [allowas-in](../12_eBGP_and_iBGP/06_AllowAS_In.md)
- [as-override](../12_eBGP_and_iBGP/07_AS_Override.md)
- [SoO](../18_MPLS_L3VPN/07_Site_of_Origin.md)
- [AIGP](../08_Path_Attributes/11_AIGP.md)
- [Interview 13](../25_Interview_Questions/13_AllowAS_In_AS_Override_AIGP.md)
- [PE-CE toolkit](../18_MPLS_L3VPN/08_PE_CE_AS_Loop_Toolkit.md)

---
