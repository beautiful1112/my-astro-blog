# End-to-end IP traffic flow

Designers must narrate a packet’s path and the **control state** that made that path exist. “It uses BGP” is not an end-to-end story.

## Story template

1. Source segment / VRF / VLAN.
2. First-hop (FHRP, anycast GW, router).
3. Underlay hops (IGP/ECMP).
4. Overlay encapsulation (if any): VXLAN, IPsec, MPLS label stack.
5. Policy waypoints (FW, NAT, SD-WAN hub).
6. Egress / destination segment.
7. Return path symmetry assumptions.

```text
Host A -- L2/L3 access -- leaf/dist -- spine/core
        \-- (VXLAN/MPLS/IPsec) --/
                    |
              FW / service insert
                    |
                 Host B / SaaS
```

## Control vs data along the path

| Hop type | Data plane | Control dependency |
|---|---|---|
| L3 access ECMP | IP forward | IGP/BGP RIB → FIB |
| VXLAN leaf | Outer + VNI | EVPN/control learn |
| MPLS P | Label swap | LDP/SR + IGP |
| SD-WAN edge | Encapped | Overlay TLOC/policy |
| Stateful FW | Inspect/NAT | Session table + routing |

If control is down but FIB is stale, behavior depends on NSF/GR and timers—design must say which.

## Asymmetry and state

| Design choice | Risk |
|---|---|
| ECMP without symmetric hashing needs | Stateful middlebox drops |
| Separate Internet exits per half campus | Broken sessions |
| NAT on only one path | Return blackhole |
| Anycast without careful health | Flapping state |

## Real-world — hybrid call center

**Brief:** Agents in campus; softphone to cloud PBX; recording appliance on-prem; PCI payment iframe to SaaS.

| R / C / A | Statement |
|---|---|
| R | Voice MOS acceptable; payment traffic isolated; recording lossless |
| C | One central FW cluster; dual DIA; SD-WAN to branches only |
| A | “Default route to DIA for everything” is fine — false for recording + PCI |

**Flow design:** Voice UDP to cloud via prioritized DIA; recording stays hairpinned to on-prem; PCI VRF through PEP. Reject single default-route story for all three.

## Debugging from design docs

Good HLD lets ops ask: where is state, where is encap, where is policy? If the diagram cannot answer, it is incomplete.

## Risks

- Overlay diagrams that omit underlay dependency.
- Ignoring return path and middlebox state.
- Assuming DNS and MTU “just work” across encaps.

## Interview framing

“I describe end-to-end flow as data-plane steps plus the control and policy state each step needs—including return path and middleboxes.”

## Related

- [Control, data, management planes](01_Control_Data_Management_Planes.md)
- [Overlay, underlay, and fabric](04_Overlay_Underlay_and_Fabric.md)
- [Policy and orchestration planes](05_Policy_and_Orchestration_Planes.md)

## Decision checklist

1. Which numbered requirement does this choice serve?
2. Which constraint forbids the popular alternative?
3. What failure domain did we shrink or accept?
4. What is the migration/rollback story?
5. How will ops prove it on a Tuesday night?
## Failure modes to narrate

| Fault | Bad design reaction | Good design reaction |
|---|---|---|
| Link/node loss | Timers only; no alternate | Diverse path + detect + repair |
| Control-plane churn | Flood detail everywhere | Summary/stub/level + bounded domain |
| Human change error | No canary / huge blast | Module seams + staged change |
| Dependency outage | Silent shared fate | Named fate-share + residual risk |
## What to discard

Discard slogan-driven picks (“modern,” “vendor preferred,” “more redundant”) that cannot cite R/C/A. Discard designs that cannot state what still works when one module fails.

## How you prove it

- Whiteboard the module borders and plane roles in <3 minutes
- Pull a link/node in a lab or maintenance window and compare to RTO
- Show the discarded option and the requirement that killed it

---
