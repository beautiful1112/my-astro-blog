# Session Stuck in Idle or Active

Check:

1. Neighbor address and routing to it.
2. Correct update source.
3. TCP port 179 ACL/firewall path.
4. Direct versus multihop TTL.
5. GTSM allowance.
6. TCP MD5/AO key match.
7. Local/remote ASN.
8. Passive configuration on both sides.
9. Duplicate connection/collision logs.

“Active” does not mean healthy activity; it commonly means the speaker is retrying the TCP connection.

Use a sourced ping, TCP state, packet capture, and both router logs to locate the failure.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
