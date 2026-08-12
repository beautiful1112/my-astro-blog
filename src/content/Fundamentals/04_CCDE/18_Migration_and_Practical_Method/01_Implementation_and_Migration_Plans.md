# Implementation and migration plans

A design that cannot be reached from the current network is a fantasy. CCDE domain 3.1 explicitly includes implementation, migration, and transformation.

## Good migration properties

- **Parallel** where possible (ships-in-the-night IGP, dual overlay)
- **Reversible** at each step
- **Sliced** (one building, one VRF, one region)
- **Success criteria** (traffic %, error budget, rollback trigger)
- **People** (who is on call; freeze windows)

Big-bang weekend cutovers are for when physics forces them (a move). They are not a personality.

```text
Now -> dual run -> shift traffic -> decommission
         ^ rollback here
```

## Interview framing

“Every HLD I produce has a migration that is sliced, reversible, and has a numeric success test—not a single leap of faith.”

---
