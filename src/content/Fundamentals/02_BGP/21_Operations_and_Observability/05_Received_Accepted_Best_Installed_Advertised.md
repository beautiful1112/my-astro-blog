# Five Route Views

For one prefix, name the failing stage explicitly. Mixed language (“I don’t see the route”) wastes incident time.

| View | Question | Typical evidence |
|---|---|---|
| **Received** | Did the peer send it? | received-routes / receive-protocol / BMP Adj-RIB-In |
| **Accepted** | Did import policy retain it? | Loc-RIB candidate / post-policy “routes” |
| **Best** | Did it win BGP selection? | best marker and documented reason |
| **Installed** | Did it enter RIB and FIB? | `show ip route` / CEF / FT |
| **Advertised** | Did export send it to *this* neighbor? | advertised-routes / advertising-protocol |

## Failure patterns

- **Received but rejected:** prefix/AS-path/RPKI/first-AS; `allowas-in` count exceeded; max-prefix drop.
- **Accepted but not best:** LOCAL_PREF, AIGP, MED comparison scope, IGP cost, RR path hiding, weight.
- **Best but not installed:** lower AD static/IGP, unresolved next hop, label/VRF programming failure.
- **Installed but not advertised:** iBGP split horizon, RR cluster rules, outbound deny, SoO match on PE→CE, conditional advertisement not triggered, ORF.
- **Advertised locally but remote rejects:** remote import policy, first-AS, max-prefix, RPKI Invalid.

## Advanced-feature checkpoints

| Symptom class | Also verify |
|---|---|
| PE-CE missing inter-site routes | [allowas-in](../12_eBGP_and_iBGP/06_AllowAS_In.md) / [as-override](../12_eBGP_and_iBGP/07_AS_Override.md) |
| Site learns own prefixes back | [SoO](../18_MPLS_L3VPN/07_Site_of_Origin.md) suppression on PE→CE |
| Wrong exit across backbone | [AIGP](../08_Path_Attributes/11_AIGP.md) present and compared |
| Peer “not getting” prefixes | [ORF](../11_Policy_and_Traffic_Engineering/09_ORF.md), [conditional advertisement](../11_Policy_and_Traffic_Engineering/10_Conditional_Advertisement.md) |
| Unequal ECMP not weighting | [link-bandwidth](../11_Policy_and_Traffic_Engineering/11_Link_Bandwidth_Community.md) + multipath |

## Operator phrasebook

| Vague statement | Precise replacement |
|---|---|
| “I don’t see the route” | “Not in received-routes from peer X” / “received but not accepted” / … |
| “BGP has it” | “Best in Loc-RIB” vs “installed in RIB/FIB” |
| “We’re advertising it” | “Present in advertised-routes to neighbor Y” |

## Command mapping (typical)

| View | Cisco-ish | Junos-ish |
|---|---|---|
| Received | `received-routes` | `receive-protocol bgp` |
| Accepted | `neighbors … routes` | `show route protocol bgp` |
| Best | `show bgp …` best marker | `show route detail` |
| Installed | `show ip route` / CEF | `show route forwarding-table` |
| Advertised | `advertised-routes` | `advertising-protocol bgp` |

Use these five terms in tickets and handoffs. Pair with [Operational Inspection Order](01_Operational_Inspection_Order.md).

---
