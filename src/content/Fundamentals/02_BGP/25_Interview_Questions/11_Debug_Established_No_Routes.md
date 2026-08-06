# Interview: Debug Established but No Routes

## Question

How would you troubleshoot an Established BGP peer with no routes?

## Strong answer

I would select the exact AFI/SAFI and check negotiated capability, family activation, received count, import policy, origin route, export policy, and per-neighbor advertised count. I would compare both peers. Established proves TCP and OPEN negotiation, not family authorization or NLRI exchange.

---

