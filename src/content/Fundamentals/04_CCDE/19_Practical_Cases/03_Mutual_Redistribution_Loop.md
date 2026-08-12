# Case: mutual redistribution loop

## Symptom

After a merger, OSPF and EIGRP were mutually redistributed at two borders “so everyone sees everything.” Metrics oscillated; prefixes flapped; WAN melted.

## R/C/A

- R: reachability between firms in 60 days
- C: cannot renumber yet; two NOCs
- A: redistribution is harmless if you do it twice

## Options

| A | BGP seam, tagged one-way leaks, defaults inside |
| B | Keep dual redistribute, add distribute-lists ad hoc |

**Pick A.** B is a forever incident. Tags and a single policy AS.

## Lesson

Two IGPs want a BGP (or equivalent) seam, not a mesh of mutual redistribute.

---
