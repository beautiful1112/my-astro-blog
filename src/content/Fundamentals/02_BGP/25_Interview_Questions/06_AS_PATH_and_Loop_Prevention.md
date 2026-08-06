# Interview: How Does BGP Prevent Loops?

## Question

How does BGP prevent loops in eBGP and iBGP?

## Strong answer

For eBGP, each AS normally prepends its ASN, and a receiver rejects a path containing its own ASN. For ordinary iBGP, the ASN is not prepended, so a route learned from one iBGP peer is not advertised to another. Route reflection uses ORIGINATOR_ID and CLUSTER_LIST; confederations use member-AS path segments.

## Follow-up

allowas-in, as-override, and route-server behavior are deliberate exceptions that require constrained policy.

---

