# Common multicast misconceptions

| Misconception | Correction |
|---|---|
| Sender joins to send | Join controls reception. |
| IGMP routes multicast | IGMP reports local listeners; PIM builds routed trees. |
| Snooping blocks multicast | It constrains replication; bad state can black-hole traffic. |
| PIM neighbor up proves service | RPF, RP/source state, OIL, policy, hardware, and data must also work. |
| RP failure always stops data | Existing SPT flows may continue while new flows fail. |
| SSM is only an address range | It is a source-aware `(S,G)` service model. |
| Two groups equal redundancy | Only independent end-to-end paths plus arbitration provide resilience. |
| No switch drops means no loss | NIC, driver, kernel, socket, bypass stack, and application can drop. |
| More buffering solves loss | It can convert loss into stale-data latency. |
| TTL secures scope | TTL is a hop bound; use boundaries and policy. |
| MBGP advertises multicast groups | Multicast SAFI advertises source/RP IP prefixes for RPF, not receiver groups. |
| BGP session up proves multicast routing | The AFI/SAFI, NLRI policy, best path, MRIB, PIM, tunnel, and MFIB must still work. |
| MSDP carries multicast data | It advertises active IPv4 ASM sources; native multicast follows a PIM tree. |
| MVPN route present means packets can flow | The PMSI tunnel, label/VRF binding, and hardware forwarding must also be ready. |
| EVPN SMET is a data tunnel | SMET signals receiver interest; ingress replication or another tunnel carries packets. |
| VXLAN underlay multicast provides tenant routing | It can replicate BUM frames, but cross-subnet tenant multicast needs a separate L3/control-plane design. |
