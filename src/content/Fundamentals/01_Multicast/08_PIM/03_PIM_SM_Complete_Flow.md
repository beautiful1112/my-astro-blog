# PIM Sparse Mode complete flow

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Receiver builds the shared tree

The receiver reports `G`. The LHR creates `(*,G)` with the receiver OIF and sends a PIM Join toward the RP. Joins merge into an RP-rooted shared tree.

## Source registers

The source sends without waiting. Its FHR encapsulates the multicast packet in a unicast PIM Register to the RP. The RP decapsulates and forwards down the RPT, then sends `(S,G)` Join toward the source. Once native packets arrive, the RP sends Register-Stop. The FHR later sends Null-Registers as probes.

## Last hop switches to SPT

The LHR learns `S`, sends `(S,G)` Join toward it, accepts traffic on the source tree, sets the SPT bit, and sends `(S,G,rpt)` Prune toward the RP. This reduces latency and path stretch.

Immediate SPT behavior is normally desirable for latency-sensitive streams.

