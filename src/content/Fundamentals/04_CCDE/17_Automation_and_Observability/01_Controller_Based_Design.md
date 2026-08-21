# Controller-based design

A controller is a **central control, management, and/or policy** component—SD-WAN, ACI, SDA, wireless, cloud-managed campus, fabric services. The exam is not “which GUI”; it is **planes, fate, southbound reachability, and what happens when the controller is gone**.

## Planes to name explicitly

| Plane | Controller role | Forwarding if controller dies |
|---|---|---|
| Management | Inventory, image, certs | Devices keep running |
| Policy / change | Templates, ZTP, intent push | Often **no new change**; existing may persist |
| Control (some fabrics) | Centralized CE / TE decisions | May degrade or fail if design is tight-coupled |

```text
Operators / CI
      |
 Controller cluster (HA, region diversity, backup)
      | southbound (reachability is a design object)
 Network devices / edges
      |
 Data plane (packets)  ← must state: depends on controller? yes/no
```

If Day-0 **requires** the controller but Day-2 forwarding does **not**, say so. If both do, the controller cluster is inside the RTO budget.

## Real-world — SD-WAN controller in one public region

**Built:** Single controller cluster in one cloud region; branches on DIA only.

**Incident:** Region impairment → no policy changes, no ZTP for new stores; some edges fail-closed on template refresh. Black Friday store opens blocked.

**Repair:** Multi-region controller / on-prem + cloud hybrid per product; OOB management path; document **last-known-forward** for traffic; second underlay so edges stay reachable for recovery.

## Real-world — ACI / fabric “brain” assumptions

**Claim:** Dual APIC nodes = fabric HA.

**Missed:** Both APICs and critical spines in one failure domain (power/room); apps still depended on fabric policies that needed healthy control for some Day-2 ops.

**Design:** Treat APIC/controller cluster as its own domain; site power diversity; backup/export of policy; clear statement of which faults freeze changes vs freeze packets.

## HA and placement patterns

| Pattern | Fits | Watch |
|---|---|---|
| Cluster in one DC | Lab / small | Site loss = control loss |
| Cluster across AZs/sites | Enterprise | Latency, split-brain rules |
| Cloud-hosted controller | Fast scale | Vendor region + Internet path fate |
| Hybrid (on-prem + cloud) | Regulated | Sync and authority which is master |

Southbound design questions:

- Can edges reach controllers when the production underlay is sick? (OOB / LTE / management VRF)
- Is authentication to controllers a shared fate with the IdP?
- Are backups offline and restorable without the live cluster?

## Day-0 / Day-1 / Day-2

| Phase | Controller dependency | Design note |
|---|---|---|
| Day-0 ZTP | High | Factory/bootstrap network path |
| Day-1 policy | High | Canary push |
| Day-2 steady forward | Product-specific | Write it down |
| Day-2 change | High | RTO for *change* may differ from *traffic* |

## Risks

- Controller as undeclared SPOF for forwarding.
- One Ansible/controller push to all sites (change fate).
- No export/backup of intent.
- Assuming “HA pair” without asking AZ/site/power.

## Interview framing

“I design the controller as a system with its own RTO: cluster placement, southbound reachability, backups, and whether forwarding survives its death. Change plane outage and packet plane outage are different sentences.”

## Related

- [Centralized versus distributed control](../04_Planes_and_Traffic_Flow/03_Centralized_vs_Distributed_Control.md)
- [Policy and orchestration planes](../04_Planes_and_Traffic_Flow/05_Policy_and_Orchestration_Planes.md)
- [CI/CD for the network](03_CI_CD_for_Network.md)
- [SD-WAN design](../13_Campus_WAN_and_Edge/03_SD_WAN_Design.md)
- [Case: SD-WAN without underlay](../19_Practical_Cases/05_SDWAN_Without_Underlay.md)

---
