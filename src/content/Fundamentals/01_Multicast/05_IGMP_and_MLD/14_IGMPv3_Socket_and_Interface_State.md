# IGMPv3 socket state and interface-state merge

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

IGMPv3 distinguishes what each application socket requests from what the host reports for the interface.

## Per-socket state

Conceptually:

**(socket, interface, group, filter mode, source list)**

Two applications can request different source filters for the same group on one NIC.

## Interface merge rules

The kernel must advertise an interface state that satisfies every socket.

### All sockets are INCLUDE

Union the source lists:

**INCLUDE(A) + INCLUDE(B) = INCLUDE(A ∪ B)**

Example:

- Socket 1: INCLUDE {S1, S2}
- Socket 2: INCLUDE {S2, S3}
- Interface: INCLUDE {S1, S2, S3}

### At least one socket is EXCLUDE

The interface is EXCLUDE:

**EXCLUDE((intersection of all EXCLUDE lists) − (union of all INCLUDE lists))**

Example:

- Socket 1: EXCLUDE {S1, S2, S3}
- Socket 2: EXCLUDE {S2, S3, S4}
- Socket 3: INCLUDE {S3, S5}
- Intersection of excludes = {S2, S3}
- Subtract included sources {S3, S5}
- Interface: EXCLUDE {S2}

Any socket requesting a source must prevent that source from being excluded at interface level.

## Empty-list meanings

- **EXCLUDE {}:** receive G from all sources; traditional ASM join.
- **INCLUDE {}:** receive G from no source; conceptual no-membership state.

## Delivery after interface acceptance

The NIC/IP layer may accept a packet because the merged interface state permits it, but the kernel still applies each socket's own source filter and UDP binding before delivery. Therefore:

> Packet visible at the NIC or host capture does not prove every listening socket receives it.

Primary reference: [RFC 3376, Sections 3.1–3.2](https://www.rfc-editor.org/rfc/rfc3376.html#section-3).

