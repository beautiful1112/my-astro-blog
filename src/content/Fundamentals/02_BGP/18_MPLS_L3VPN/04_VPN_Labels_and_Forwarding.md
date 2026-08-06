# VPN Labels and Forwarding

An L3VPN packet commonly carries:

- An outer transport label that reaches the egress PE.
- An inner VPN/service label that identifies the egress VRF or forwarding context.

Penultimate-hop popping may remove the transport label before the egress PE, leaving the VPN label for service lookup.

The control plane must program both transport and service resolution. A route visible in MP-BGP can still fail if the transport LSP, label allocation, or egress VRF adjacency is missing.

Trace labels hop by hop when IP-only diagnostics stop at the provider edge.

---

