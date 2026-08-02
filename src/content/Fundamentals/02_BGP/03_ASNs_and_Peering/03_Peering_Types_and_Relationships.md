# Peering relationships

Operational relationships shape policy:

- **Customer:** pays the local AS for transit. Customer routes are normally exported to all neighbors.
- **Provider:** supplies transit. Provider-learned routes are normally exported only to customers.
- **Settlement-free peer:** exchanges customer cones, not full transit between providers/peers.
- **Private interconnect:** direct physical/logical peering for controlled traffic.
- **Route server:** exchange-fabric service that distributes routes while commonly preserving the advertising participant's next hop.

Incorrect relationship classification is a primary cause of route leaks.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
