# Case 17: EVPN SMET route exists but tenant multicast is not delivered

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Symptom

The receiver VTEP has local IGMP state and originates a Type 6 SMET route. The source VTEP imports that route, but no tenant multicast packet reaches the receiver site.

## Why route presence is insufficient

SMET expresses remote interest. The source VTEP must still bind that interest to a data transport:

- add receiver VTEP to an ingress-replication list;
- join/build an underlay multicast/selective tunnel; or
- program another supported PMSI mechanism.

A missing IMET/tunnel route, wrong VNI/Ethernet Tag, failed underlay next hop, or ASIC programming error leaves the control route present without an OIF.

## Investigation

1. verify local Report and correct `(*,G)`/`(S,G)` source-filter semantics;
2. decode Type 6 EVI, Ethernet Tag, group, source, and flags;
3. confirm Route Target import at source VTEP;
4. inspect the derived remote OIF/tunnel list;
5. verify IMET/PMSI/underlay group and remote VTEP reachability;
6. capture outer VXLAN packet at source uplink;
7. if present, verify remote decap VNI and listener-port replication;
8. compare logical and hardware entries.

## Common split

```text
Type 6 route: present
derived overlay OIF: receiver VTEP
hardware tunnel list: missing
outer packets: zero
```

This localizes the issue between EVPN route processing and hardware/tunnel programming.

## Lesson

EVPN membership signaling and VXLAN transport are separate planes. Always prove SMET import, tunnel binding, encapsulation, decapsulation, and access replication.
