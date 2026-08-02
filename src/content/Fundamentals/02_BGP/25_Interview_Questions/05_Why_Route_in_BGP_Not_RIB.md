# Interview: Why Is a BGP Route Not in the RIB?

## Question

A route is best in the BGP table but absent from the main route table. Why?

## Strong answer

Possible reasons include an unresolved next hop, a more-preferred route from another protocol, recursive-loop or resource failure, wrong VRF/table, or missing tunnel/label resolution for a service route. “Best” means best among BGP candidates. I would inspect the route-table inactive reason and next-hop recursion before changing policy.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
