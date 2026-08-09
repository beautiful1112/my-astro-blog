# Path-Attribute Memory Table

| Attribute | Transitivity (typical) | Preference | Notes |
|---|---|---|---|
| WEIGHT | Local Cisco | Higher | Not in UPDATE |
| LOCAL_PREF | Well-known discretionary (iBGP) | Higher | Early decision; outbound exit |
| AS_PATH | Well-known mandatory | Shorter | eBGP loop check |
| ORIGIN | Well-known mandatory | IGP < EGP < Incomplete | |
| MED | Optional non-transitive | Lower | Same neighbor AS by default |
| NEXT_HOP | Well-known mandatory | Must resolve | next-hop-self / unchanged |
| COMMUNITY | Optional transitive | Policy | Often stripped at edges |
| EXTCOMMUNITY | Optional transitive | Policy | RT, SoO, link-bandwidth |
| AIGP | Optional non-transitive | Lower | RFC 7311; trusted domain |
| AS4_PATH | Optional transitive | — | 4-byte AS compatibility |

## Decision-order mnemonic (simplified)

**W L O A O M N E I R** — Weight, Local_pref, local Originate, As_path, Origin, (AIGP on capable platforms), Med, eBGP-over-iBGP, IGP-to-NH, RID… Verify vendor docs for AIGP insertion point.

## Extended-community quick hits

| Community | Purpose |
|---|---|
| Route Target | VPN import/export |
| SoO (`origin:`) | Site loop prevention |
| Link-bandwidth | Weighted multipath signal |
| OTC | Leak signaling (roles) |

## Cross-links

[AIGP](../08_Path_Attributes/11_AIGP.md), [SoO](../18_MPLS_L3VPN/07_Site_of_Origin.md), [Link-bandwidth](../11_Policy_and_Traffic_Engineering/11_Link_Bandwidth_Community.md).

---
