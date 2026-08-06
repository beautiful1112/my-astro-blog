# Prefix Independent Convergence

Prefix Independent Convergence (PIC) precomputes shared backup next-hop structures so many prefixes can switch after one next-hop failure without individually reprogramming every route.

The idea is hierarchy:

- BGP prefixes point to a common recursive next-hop object.
- That object has primary and backup forwarding resolution.
- Failure updates the shared object rather than every prefix independently.

PIC edge protects external next-hop failures; PIC core commonly relies on fast underlay repair.

Implementation support, eligible backup criteria, and FIB scale vary. Verify actual forwarding loss with hardware counters and traffic, not only control-plane failover.

---

