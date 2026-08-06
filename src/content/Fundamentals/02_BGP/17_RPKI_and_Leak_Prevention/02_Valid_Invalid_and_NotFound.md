# RPKI Origin-Validation States

For a BGP route:

- **Valid:** at least one covering VRP authorizes both the origin ASN and route prefix length.
- **Invalid:** a covering VRP exists, but the origin ASN or maximum-length condition fails.
- **NotFound:** no VRP covers the route.

Example: a VRP for 203.0.113.0/24, maxLength /24, ASN 64500 makes that exact route Valid. A /25 from ASN 64500 is Invalid because it is too specific. A /24 from ASN 64501 is Invalid because the origin differs.

NotFound means “no validated authorization data,” not “malicious.”

---

