# Unresolved BGP Next Hop

Start with the next hop stored on the exact BGP path. Then:

1. Look it up in the correct VRF/address family.
2. Follow recursive resolution to a connected adjacency or tunnel.
3. Confirm the route is not recursively dependent on itself.
4. Check next-hop-self policy and underlay advertisement.
5. For VPN/EVPN, verify label or tunnel resolution.
6. Confirm hardware adjacency programming.

Do not test only the advertised destination. Reachability to the next hop is the dependency that makes the route usable.

---

