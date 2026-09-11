# One eBGP unit per rack

RFC 7938 pattern: one repeated eBGP unit per rack. Four spines in AS 65000 connect to multiple leaves, each in a distinct autonomous system. Four single-hop adjacencies per leaf; ECMP to every remote VTEP.

```text
Spine AS 65000:  Spine 1   Spine 2   Spine 3   Spine 4
                    |         |         |         |
Leaf 01 AS 65101 ---+---------+---------+---------+
Leaf 02 AS 65102 ---+---------+---------+---------+
Leaf 60 AS 65160 ---+---------+---------+---------+

Four single-hop eBGP adjacencies per leaf · ECMP to every remote VTEP
```

## Why a distinct ASN per leaf

- Explicit neighbor and policy boundary.
- ASN, peer-group, prefix policy, and maximum-prefix are easy to generate.
- Withdrawals follow explicit adjacencies; policy limits leaks.

Leaf ASN in this notebook: `65100 + rack ID`. Leaf 17 is AS 65117.

## Overlay sessions are different

Underlay eBGP is the Clos IGP equivalent. Overlay EVPN is iBGP (or eBGP EVPN) between leaf loopbacks and spine route reflectors. Do not collapse those two BGP uses into one mental model.

## Related

- [Underlay contract](01_Underlay_Contract.md)
- [eBGP versus IGP](03_eBGP_versus_IGP.md)
- [Leaf intent and guardrails](04_Leaf_Intent_and_Guardrails.md)
- [Spines as EVPN route reflectors](../04_EVPN_VXLAN/04_Route_Reflectors_and_Anycast_Gateway.md)

---
