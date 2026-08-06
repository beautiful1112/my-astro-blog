# eBGP vs iBGP and IGP Cost to Next Hop

When higher attributes tie, many implementations prefer an eBGP-learned path over an iBGP-learned path. Later, the router may compare IGP distance to each BGP next hop, commonly called **hot-potato routing** or closest exit.

This means an IGP metric change can move Internet egress without changing any BGP attribute. It can also create different exit choices across routers in the same AS.

Hot-potato routing minimizes cost inside the local network, not end-to-end latency. A trading network may intentionally use LOCAL_PREF or performance-driven policy to keep traffic on the backbone longer for a better external path.

Always distinguish:

- BGP best path.
- Route-source administrative distance used to enter the RIB.
- IGP metric used to resolve a BGP next hop.

---

