# Design is not implementation

**Design** decides *what must be true* of the system: modules, boundaries, roles, contracts, and how change and failure are absorbed. **Implementation** makes a specific instance true on devices, controllers, and tickets.

CCDE fails when you jump to “configure OSPF area 1” before you know whether OSPF is even the right IGP, or whether the failure domain should exist.

## Two different questions

| Design question | Implementation question |
|---|---|
| Where is the L2/L3 boundary? | Which VLAN, SVI, and trunk allow list? |
| Who is the policy point for guest? | Which ISE policy set and dACL? |
| How big is the IGP domain? | What is the hello/dead and SPF throttle? |
| Must sites survive hub loss? | Which tunnel destination and key? |

Implementation detail still matters for **feasibility**. If BFD cannot run on the proposed WAN, the HA story is fiction. Designers use implementation knowledge as a **constraint**, not as the deliverable.

## HLD stays technology-aware

“Use a hierarchical campus with L3 to the access” is design. “Use Catalyst 9k with this exact image” is procurement/implementation—unless the scenario *constrains* a platform.

```text
HLD:  L3 access, dual core, summarization at distribution
LLD:  area IDs, HSRP groups, QoS PHB map, IGP timers
Build: configs, change windows, validation commands
```

Written lives mostly in HLD. Practical often needs enough LLD to choose among options. Neither is a config lab.

## Ops is part of design

If only two people can operate a controller fabric, the design has an operational SPOF even if the data plane is dual-homed. “We will automate later” is an assumption—write it down.

## Interview framing

“I do not start from CLI. I start from the invariant the business needs, then I pick the coarsest design that operations can run—and I use protocol detail only to prove it is possible.”

---
