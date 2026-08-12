# Control, data, and management planes

A design that only draws links is incomplete. Say **who computes**, **who forwards**, and **who operates**.

## The three classic planes

| Plane | Job | Examples |
|---|---|---|
| **Data** | Forward user/application packets | CEF/FIB, ASIC, VXLAN encap, MPLS label swap |
| **Control** | Compute and distribute forwarding state | OSPF, BGP, LDP, EVPN, SD-WAN DTLS, spanning-tree |
| **Management** | Configure, observe, authenticate operators | SSH, NETCONF, gNMI, controller UI, AAA, syslog |

They fail independently. BGP can be Established while the next hop is unreachable (control up, data dead). A controller outage can freeze **change** while packets still flow—or, in a bad design, freeze forwarding too.

```text
Management:  humans / CI / telemetry  --> devices or controller
Control:     peers / controller       --> RIB / policy
Data:        packets                  --> FIB / fabric
```

## Design rules

1. **Do not fate-share** all three on one path if RTO cares. OOB management, or at least a way in when the IGP dies.
2. Know whether a controller is in the **forwarding** path or only in the **change** path.
3. CoPP and control-plane security protect the brain; they are not optional decorations.

## Exam trap

An option that “simplifies” by putting management in-band only, with no surviving path after a data-plane loop or WAN cut, fails operational design even if the happy-path drawing is clean.

## Interview framing

“I design three planes. If I cannot say how I still manage and how packets still flow when the controller or IGP is sick, I do not have an HA story.”

---
