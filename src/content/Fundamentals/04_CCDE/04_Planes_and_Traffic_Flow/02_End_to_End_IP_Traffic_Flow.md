# End-to-end IP traffic flow

CCDE asks you to follow a packet through a **feature-rich** path: NAT, firewall, overlay, QoS, load balancer—not just “left to right on the diagram.”

## Method

1. Name source, destination, and application (TCP/UDP/QUIC, elephant vs mice).
2. Walk **encapsulation** changes (VLAN → IP → GRE/IPsec/VXLAN/MPLS).
3. Note every **policy point** (ACL, NAT, FW, SD-WAN SLA, WAF).
4. Note **return path** (stateful FW, asymmetric routing, uRPF).
5. Note **failure alternate** at each hop.

```text
User -- L2/L3 access -- campus/WAN overlay -- FW/NAT -- DC/cloud service
         |                 |                    |
       QoS mark         SLA/color            decrypt/inspect?
```

If you cannot draw the return path, you do not understand the flow. Asymmetry through a stateful firewall is a classic silent outage.

## Feature-rich pitfalls

| Feature | Flow surprise |
|---|---|
| NAT | Breaks inbound, logs, and some IPsec |
| Overlay | MTU, DF bit, inner vs outer QoS |
| Load balancer | SNAT hides client; health vs real app |
| Multicast | Different tree than unicast RPF |
| IPv6 | Dual-stack may take a different FW path |

## Interview framing

“I follow one packet and its return through every encap and policy point, then I break one hop and say where it dies. If I cannot, the HLD is a cartoon.”

---
