# Lab: EVPN MAC Mobility

## Topology

Two VTEPs attach a movable test host in one tenant VNI.

## Objectives

- Observe EVPN type 2 and type 3 routes.
- Move a MAC between VTEPs.
- Inspect mobility sequence and ARP/ND suppression.

## Tasks

1. Verify underlay reachability and EVPN family.
2. Learn the host on VTEP A and inspect its type 2 route.
3. Move it to VTEP B.
4. Confirm the new type 2 has a higher mobility sequence.
5. Generate rapid alternating moves and observe duplicate/mobility protection.

Keep loop-prevention controls enabled during the test.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
