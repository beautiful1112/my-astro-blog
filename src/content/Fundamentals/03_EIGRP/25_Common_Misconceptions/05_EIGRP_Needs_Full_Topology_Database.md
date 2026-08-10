# Misconception: EIGRP Keeps a Full Network Topology Database

## The myth

“Like OSPF, EIGRP stores the entire network topology.”

## Why it is wrong

The EIGRP **topology table** holds destinations and paths learned via neighbors (successors/FS candidates)—**not** a complete link-state map of every router/link. A router does not independently SPF an LSDB of the AS. Knowledge is DV-scoped; Queries diffuse to discover alternatives when local FS is absent.

## Why the name confuses

“Topology table” sounds LSDB-like. Read it as **DUAL topology (prefix path) table**, not OSPF database.

## Counterexample

```text
R1 ---- R2 ---- R3 ---- R4 ---- Dest
```

On R1, `show ip eigrp topology` for Dest shows path(s) via R2 (metric/RD)—**not** an entry “R3–R4 link up/down.” If R3–R4 fails and R2 has an FS, R1 may learn a new vector without ever knowing which remote link changed. OSPF would carry router-LSAs and recompute.

If R1 has no FS and R2 goes Active, R1 participates in diffusion; it still never builds a full graph of the AS.

## Ops symptom table

| Expectation (myth) | Reality |
|--------------------|---------|
| “Show me every link” | Topology = prefixes + via neighbors |
| Remote link flap always recomputes local SPF | May be invisible until path vector changes |
| Same troubleshooting as OSPF `show ip ospf database` | Use neighbors + topology Passive/Active + RIB |

## Correct habit

`show ip eigrp topology` answers “what paths do I know for prefixes?”—not “show me every link in the company.”

## Related

- [Three EIGRP tables](../06_Topology_Table_and_RIB/01_Three_EIGRP_Tables.md)
- [Topology table entries](../06_Topology_Table_and_RIB/02_Topology_Table_Entries.md)
- [Reading show eigrp topology](../06_Topology_Table_and_RIB/06_Reading_Show_EIGRP_Topology.md)
- [Advanced distance vector](../02_Fundamentals/03_Advanced_Distance_Vector.md)

---
