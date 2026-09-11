# Flood and learn

How a remote MAC appears without EVPN.

1. **Local learning** — Leaf 1 learns MAC-A on its server-facing port.
2. **BUM replication** — ARP is VXLAN-encapsulated to every static peer.
3. **Remote learning** — Leaf 2 maps inner source MAC-A to Leaf 1's VTEP.
4. **Unicast** — The reply teaches MAC-B; later traffic is direct.

```text
Host A --ARP for B--> Leaf 1  (learn MAC-A locally)
Leaf 1 --VXLAN BUM--> Leaf 2  (map MAC-A to Leaf 1 VTEP)
Leaf 2 --flood ARP--> Host B
Host B --ARP reply--> Leaf 2 --VXLAN unicast--> Leaf 1  (learn MAC-B)
```

Host moves depend on traffic, gratuitous ARP, or aging. There is no mobility sequence.

## Related

- [Encapsulation versus control plane](01_Encapsulation_versus_Control_Plane.md)
- [Static versus EVPN](03_Static_versus_EVPN.md)

---
