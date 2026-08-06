# Minimal PIM-SM ASM configuration pattern

```text
ip multicast-routing
ip pim rp-address 10.255.0.1

interface Vlan100
 ip pim sparse-mode

interface Vlan200
 ip pim sparse-mode

interface Port-channel10
 ip pim sparse-mode
```

Production design must scope the RP to intended groups, provide reachability and resilience, and control permitted sources.

