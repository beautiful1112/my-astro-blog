# Asymmetry and Data-Plane Failure

If BGP looks correct but traffic fails:

- Check longest-prefix match in both directions.
- Verify FIB adjacency, ARP/ND, label/tunnel, and MTU.
- Inspect ACL, uRPF, NAT, firewall state, and policy routing.
- Trace from the actual source address.
- Compare ECMP hash behavior and failing flow tuple.
- Check remote return-path advertisements.

Control-plane evidence must be paired with packet and counter evidence. A route in the RIB does not prove the ASIC forwards it correctly.

---

