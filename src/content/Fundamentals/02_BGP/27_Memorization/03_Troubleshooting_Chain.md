# BGP Troubleshooting Chain to Memorize

For one exact prefix:

**Peer → Family → Received → Accepted → Eligible → Best → RIB → FIB → Advertised → Remote → Return**

Questions:

1. Is transport/session up?
2. Is the AFI/SAFI negotiated?
3. Did the peer send the route?
4. Did import policy accept it?
5. Is the next hop and route valid?
6. Why did it win or lose?
7. Did another protocol win the RIB?
8. Did hardware install it?
9. Did export policy advertise it?
10. What did the remote side select?
11. Does the return path work?

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
