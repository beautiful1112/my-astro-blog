# Learning objectives

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

After completing this library, you should be able to:

- distinguish multicast from unicast, broadcast, and anycast;
- explain receiver-driven forwarding and why a sender need not join;
- calculate IPv4 and IPv6 multicast Ethernet addresses;
- explain IGMPv1/v2/v3, MLDv1/v2, and source filtering;
- explain snooping, queriers, mrouter ports, and unknown multicast;
- perform an RPF check and read `(*,G)`, `(S,G)`, and `(S,G,rpt)` state;
- narrate PIM-SM registration, Register suppression/probing, shared-tree forwarding, SPT switchover, and RPT pruning;
- decode PIM Hello, Join/Prune, Register, Register-Stop, Assert, and Bootstrap messages;
- compare ASM, SSM, PIM-DM, PIM-SM, and BIDIR-PIM;
- explain static RP, BSR election and RP hashing, Anycast RP, MSDP, and their failure modes;
- design RP redundancy across mapping, reachability, and source-state synchronization;
- design and troubleshoot redundant UDP multicast market-data delivery;
- separate network loss from NIC, kernel, socket, and application loss;
- discuss security, capacity, QoS, MTU, convergence, virtualization, and observability.

