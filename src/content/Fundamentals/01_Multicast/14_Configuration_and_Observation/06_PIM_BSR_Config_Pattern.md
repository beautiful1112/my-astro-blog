# PIM BSR configuration pattern

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

This Cisco IOS-like example illustrates roles and policy; exact commands and defaults vary by platform.

```text
! On two intended candidate BSRs
ip pim bsr-candidate Loopback0 30 100

! On each candidate RP
ip pim rp-candidate Loopback0 group-list ASM-GROUPS priority 10

ip access-list standard ASM-GROUPS
 permit 239.10.0.0 0.0.255.255
```

Conceptually configure:

- at least two reachable candidate BSR loopbacks with deliberate BSR priority;
- at least two reachable candidate RPs for required ASM group ranges;
- RP priority and hash-mask behavior that produce the intended mapping;
- BSR and RP filtering at administrative boundaries;
- PIM on every transit interface in the Bootstrap flooding path; and
- SSM ranges separately so they never map to an RP.

Do not copy syntax until checking the platform meaning of priority and mask fields. BSR election prefers **higher** BSR priority, while RP selection prefers **lower** candidate-RP priority.

## Validate in four stages

```text
show ip pim bsr-router
show ip pim rp-hash 239.10.10.10
show ip pim rp mapping
show ip pim group-map 239.10.10.10
```

Equivalent commands should prove:

1. every router elected the same BSR;
2. the BSR received every intended candidate-RP advertisement;
3. every router learned a complete RP-set with correct group masks/priorities; and
4. every router selected the same RP for each test group.

Then fail the active BSR and mapped RP independently. Start a new source and receiver during each failure and inspect Bootstrap/RP-set timers; an established SPT alone does not validate the service.
