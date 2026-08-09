# Route Received but Rejected

Adj-RIB-In (pre-policy) has the NLRI; Loc-RIB does not accept it.

## Common reject reasons

| Reason | What to check |
|---|---|
| Prefix filter | Exact vs longer-prefix; ge/le |
| AS-path filter | Regex; private ASN; confederation segments |
| First-AS / peer-AS check | eBGP peer must insert its ASN |
| RPKI Invalid | ROA / maxLength vs announced length |
| Own ASN in path | Need [allowas-in](../12_eBGP_and_iBGP/06_AllowAS_In.md) or redesign |
| Max-prefix | Session may damp or drop prefixes |
| Malformed attribute | Treat-as-withdraw vs session reset |

## Evidence

```text
show bgp ipv4 unicast neighbors 192.0.2.1 received-routes
show bgp ipv4 unicast neighbors 192.0.2.1 routes
! Compare presence of the prefix
show bgp ipv4 unicast 203.0.113.0/24
! On Junos: show route receive-protocol vs show route
```

For PE-CE same-ASN hub/spoke, rejection of inter-site routes with “AS loop” is expected until allowas-in or PE-side [as-override](../12_eBGP_and_iBGP/07_AS_Override.md) is designed—with [SoO](../18_MPLS_L3VPN/07_Site_of_Origin.md) for site-loop safety.

Do not raise LOCAL_PREF to “fix” a rejected route—it never enters selection.

## allowas-in count example

```text
neighbor 192.0.2.1 allowas-in 1
! AS_PATH with two occurrences of local ASN still drops
```

Raise the count only with a documented topology reason; prefer fixing AS design or using as-override + SoO on PE-CE.

---
