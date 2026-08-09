# Prefix, AS-Path, and First-AS Validation

External route acceptance should verify multiple dimensions of each UPDATE. Syntactic validation cannot prove the entire path is genuine, but it sharply narrows accident and attack surface.

## Checks

| Check | Intent |
|---|---|
| Prefix allow-list / IRR | Peer may only send authorized space |
| Prefix length bounds | Reject /0 surprises or ultra-specifics as policy dictates |
| **First-AS** | Neighbor ASN must be leftmost in AS_PATH |
| Bogon ASN / prefix | Drop reserved, documentation, private where inappropriate |
| AS_PATH length / regex | Plausibility and leak patterns |
| RPKI state | Origin authorization—module 17 |
| OTC / roles | Relationship leak detection |

## First-AS enforcement caveat

On an **Internet Exchange route server**, the RS often does **not** prepend its own ASN. First-AS checks that expect the RS ASN will break the fabric. Use relationship-specific policy: enable first-AS on ordinary eBGP, disable or adapt on RS clients.

See [Route Server Behavior](../20_Advanced_Families/07_Route_Server_Behavior.md) and [next-hop-unchanged](../12_eBGP_and_iBGP/09_Next_Hop_Unchanged.md).

## Configuration patterns

### Cisco

```text
router bgp 65000
 neighbor 192.0.2.2 enforce-first-as
 neighbor 192.0.2.2 prefix-list CUST-IN in
 neighbor 192.0.2.2 filter-list 10 in
```

### Junos

```text
set protocols bgp group CUST enforce-first-as
set protocols bgp group CUST import CUST-IN
```

### Prefix + AS-path example

```text
ip prefix-list CUST-IN permit 203.0.113.0/24
ip as-path access-list 10 permit ^65001(_65001)*$
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **allowas-in** | Intentionally relaxes AS loop checks—document tightly |
| **as-override** | Rewrites AS_PATH on PE→CE; do not use on Internet |
| **RPKI** | Complements but does not replace prefix filters |
| **Max-prefix** | Quantity backstop after semantic filters |

## Verification

```text
show bgp ipv4 unicast neighbors 192.0.2.2 routes
show ip bgp regexp <pattern>
! inject unauthorized prefix in lab — must be rejected
```

## Interview framing

“Inbound BGP policy should check prefix authorization, first-AS, bogons, and path plausibility; disable naive first-AS on route-server sessions where the RS does not prepend.”

---
