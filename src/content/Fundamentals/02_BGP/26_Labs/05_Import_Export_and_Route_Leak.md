# Lab: Import/Export Policy and Route Leak

## Topology

AS 65010 connects to customer AS 65020 and providers AS 65030 and 65040.

## Objectives

- Build valley-free policy.
- Demonstrate and contain a route leak.

## Tasks

1. Tag routes by relationship on import.
2. Set customer > peer > provider LOCAL_PREF.
3. Export customer and local routes to all; export provider routes only to customers.
4. Temporarily permit provider-65030 routes toward provider 65040.
5. Observe the leak, prefix-count alarm, and traffic implication.
6. Restore default-deny policy and add an automated policy test.

Use documentation prefixes only; keep the lab isolated.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
