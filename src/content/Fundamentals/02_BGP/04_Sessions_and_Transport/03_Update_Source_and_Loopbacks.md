# Update source and loopback peering

Loopback peering decouples the BGP session from a single interface. Configure both peers to use and expect the loopback source, and ensure IGP/static reachability to those addresses.

A common failure is one side sourcing from a physical address while the other expects the configured loopback. TCP packets arrive but do not match the neighbor definition.

For eBGP loopbacks, multihop and loop prevention must be explicit. For iBGP, stable loopback reachability is usually carried by the IGP.

---

