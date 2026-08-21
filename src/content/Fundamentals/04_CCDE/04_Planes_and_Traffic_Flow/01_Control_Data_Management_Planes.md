# Control, data, and management planes

A design that only draws links is incomplete. Say **who computes**, **who forwards**, and **who operates**—and how each survives the others’ failure.

## The three classic planes

| Plane | Job | Examples |
|---|---|---|
| **Data** | Forward user/application packets | CEF/FIB, ASIC, VXLAN encap, MPLS swap, SD-WAN IPsec |
| **Control** | Compute and distribute forwarding state | OSPF, BGP, LDP, EVPN, STP, SD-WAN OMP/DTLS |
| **Management** | Configure, observe, authenticate operators | SSH, NETCONF, gNMI, controller UI, AAA, syslog, streaming telemetry |

They fail independently:

- BGP **Established** while next hop is down → control up, data dead.
- Controller outage → change frozen while packets still flow (good hybrid) **or** forwarding dies (bad coupling).
- Management only in-band on the sick IGP → you cannot log in to fix the outage you are in.

```text
Management:  humans / CI / telemetry  --> devices or controller
Control:     peers / controller       --> RIB / policy / labels
Data:        packets                  --> FIB / fabric / crypto
```

## Real-world — manufacturing plant + HQ SD-WAN

**Symptom:** Internet brownout. Plant OT VLAN still forwards locally. Operators cannot reach vManage in public cloud. New template push fails. Existing tunnels keep last-known policy; OT keeps running. Guest Wi-Fi captive portal (cloud) breaks.

**Plane reading:**

| Plane | State |
|---|---|
| Data (OT) | OK — local L2/L3 |
| Control (SD-WAN overlay) | Degraded — may not form new TLOCs |
| Management | Failed path to controller |
| Guest app | Failed — depended on cloud portal (UX), not on OT data plane |

**Design lesson:** Document “controller unreachable ⇒ forwarding continues; change stops; cloud-dependent portals fail.” If OT had required continuous controller heartbeats for forwarding, the brownout would have stopped production—unacceptable.

## Real-world — campus with in-band only management

Single OSPF domain. Loop or blackhole on core. Out-of-band serial/LTE not built. AAA via ISE reachable only through the broken core.

**Result:** Control and data are sick; management shares fate. Truck rolls. RTO becomes hours regardless of dual cores.

**Fix pattern:** OOB or at least a surviving path (mgmt VRF + LTE/cellular, or console servers) that does **not** depend on production IGP. CoPP so management traffic is not crushed by the storm.

## Real-world — DC fabric controller coupling

**Symptom:** Leaf-spine EVPN fabric healthy. Centralized fabric controller (or orchestration) loses connectivity after a WAN cut to the mgmt cluster. Existing VXLAN tunnels keep forwarding. Ops cannot push new VNIs or day-2 policy. A “self-healing” feature that withdraws leaves without controller heartbeat would have turned a mgmt outage into a data outage.

**Plane reading:** Data OK; control (distributed BGP EVPN) OK; management/orchestration failed. Design must state whether the controller is on the **change path only**.

## Decision table — plane survival

| Failure | Data should… | Control should… | Management should… |
|---|---|---|---|
| Controller / orchestrator down | Keep last-known forwarding | Prefer distributed protocols still peer | Use OOB / break-glass; freeze change |
| IGP / underlay brownout | Follow HA design (FRR, dual path) | May reconverge or withdraw | Surviving OOB path required |
| Data-plane storm / loop | Contain with CoPP / storm-control | Protect CPU so control survives | Reach devices without production L2 |
| AAA / IdP unreachable | Optional fail-open for data users per policy | Peering usually independent | Local break-glass accounts + OOB |

## Design rules

1. **Do not fate-share** all three on one path when RTO matters.
2. Know whether a controller is in the **forwarding** path or only in the **change** path.
3. CoPP / control-plane policing protects the brain during data-plane events.
4. Identity (ISE/IdP) is often a fourth hidden plane—if login dies company-wide, say so in the HA story.

## Verification / proof

| Drill | Pass signal |
|---|---|
| Block path to controller | Existing user traffic continues; new pushes fail cleanly |
| Kill in-band SSH only | OOB / console / LTE still reaches devices |
| Induce campus storm | CoPP keeps SSH/BGP/OSPF process responsive enough to remediate |
| Document | Runbook names which plane dies under each major failure |

## Exam / interview trap

An option that “simplifies” by putting management in-band only, with no path after a data-plane loop or WAN cut, fails **operational design** even if the happy-path drawing is clean.

## Quick plane audit questions

1. If the controller dies for two hours, do packets still flow for tier-0 apps?
2. If the production IGP is blackholed, how do you still authenticate and configure devices?
3. If the data plane storms, does CoPP keep BGP/OSPF/SSH alive long enough to remediate?
4. Is identity (ISE/IdP) fate-shared with the same sick path as user traffic?

## Interview framing

“I design three planes. If I cannot say how I still manage and how packets still flow when the controller or IGP is sick, I do not have an HA story.”

## Related

- [Centralized versus distributed control](03_Centralized_vs_Distributed_Control.md)
- [Overlay, underlay, and fabric](04_Overlay_Underlay_and_Fabric.md)
- [Fate sharing](../15_High_Availability_and_Scale/04_Fate_Sharing.md)

---
