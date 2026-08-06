# UPDATE message

An UPDATE carries:

```text
Withdrawn Routes | Total Path Attribute Length | Path Attributes | NLRI
```

In classic IPv4 unicast encoding, withdrawn prefixes and newly reachable NLRI are explicit fields. MP-BGP carries other families in `MP_REACH_NLRI` and `MP_UNREACH_NLRI` attributes.

Multiple prefixes sharing identical attributes can be packed into one UPDATE. Changing a route's attributes is an implicit replacement: advertising the same NLRI with new attributes supersedes the previous path from that peer.

---

