# Duplicate IP

Example: `10.10.10.50` appears behind two MAC addresses or two VTEPs.

1. **Confirm the VRF and owner** — Check IPAM, DHCP, CMDB, and server inventory. The same address in two isolated VRFs is legal.
2. **Resolve IP → MAC** — Inspect the VRF ARP/ND table and host database. Look for local/remote state, move counters, duplicate, hold-down, or frozen status.
3. **Resolve MAC → EVPN route** — Inspect Type-2 and L2RIB entries. Distinguish same-MAC mobility from same-IP/different-MAC duplication.
4. **Resolve VTEP → physical port** — Check NVE peers and forwarding, then log into each originating VTEP to locate the actual server port.
5. **Remove the bad source first** — Isolate or readdress the incorrect host, send gratuitous ARP from the legitimate host, then clear only the affected state.

## Nexus EVPN path (illustrative)

```text
show ip arp vrf TRADING 10.10.10.50
show fabric forwarding ip local-host-db vrf TRADING
show l2route evpn mac-ip all
show bgp l2vpn evpn route-type 2
show nve peers
show nve vni
show forwarding route vrf TRADING 10.10.10.50
```

Do not clear globally. See [identity to wire](01_Identity_to_Wire.md).

## Related

- [Overlapping addresses](../06_VRFs_and_Gateways/02_Overlapping_Addresses.md)
- [EVPN MAC mobility](../../02_BGP/19_EVPN/05_MAC_Mobility.md)

---
