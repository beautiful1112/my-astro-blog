# Lab: Route Reflection and Path Hiding

## Topology

One RR has two edge clients and one site client. The RR and site have different IGP distances to the edges.

## Objectives

- Replace an iBGP full mesh with reflection.
- Inspect ORIGINATOR_ID and CLUSTER_LIST.
- Reproduce path hiding.

## Tasks

1. Make both edges advertise the same prefix.
2. Set IGP metrics so the RR prefers edge A but the site would prefer edge B.
3. Confirm the site receives only edge A.
4. Enable an ADD-PATH mode or change reflector design.
5. Verify the site can select edge B and retains a backup.

## Failure injection

Fail edge A and measure control-plane and traffic-loss intervals before and after alternate-path visibility.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
