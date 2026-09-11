# Identity to wire

In an EVPN fabric, the same symptom can exist in the endpoint, HMM, L2RIB, BGP EVPN, NVE, or hardware forwarding state. Check them in order.

Do not clear globally. Correlate evidence first.

```text
endpoint: NIC state · bonding · ARP
access: MAC · VLAN · errors · drops
overlay: HMM · L2RIB · Type-2 · VTEP
underlay: route · ECMP · BFD · MTU
hardware: FIB · queue · buffer · optic
application: TCP reset · sequence gap
```

## Related

- [Duplicate IP](02_Duplicate_IP.md)
- [Silent receiver and blackholes](03_Silent_Receiver_and_Blackholes.md)

---
