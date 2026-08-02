# Rendezvous Point purpose

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

An RP solves ASM's rendezvous problem:

- receiver `(*,G)` joins know where to go;
- source Registers know where to go;
- sources and receivers can meet without knowing each other beforehand.

The RP is an initial data waypoint and control/discovery anchor. Existing SPT traffic may bypass it, so steady-state data can remain healthy while new receivers or sources fail after an RP problem.

