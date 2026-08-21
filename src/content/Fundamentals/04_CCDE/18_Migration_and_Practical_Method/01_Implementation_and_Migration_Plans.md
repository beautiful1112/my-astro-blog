# Implementation and migration plans

A design that cannot be reached from the current network is a fantasy. CCDE domain work on implementation, migration, and transformation expects **sliced, reversible** paths with numeric success tests—not a single leap of faith.

## Good migration properties

| Property | Meaning | Anti-pattern |
|---|---|---|
| Parallel | Old and new run together | Big-bang only |
| Reversible | Each step has rollback | “Burn the boats” |
| Sliced | One building / VRF / region | All sites Friday |
| Success criteria | Traffic %, error budget, probe SLA | “Looks good” |
| Owned | On-call, freeze, comms | Hero engineer alone |

```text
Now --> dual-run --> shift traffic --> decommission
              ^
         rollback here (and here)
```

Big-bang weekend cutovers are for when physics forces them (a move, a hard vendor sunset). They are not a personality trait.

## Migration patterns

| Pattern | Use when | Example |
|---|---|---|
| Ships-in-the-night IGP | Protocol swap | OSPF + IS-IS dual, then prefer |
| Dual overlay | SD-WAN introduce | MPLS stays; DIA overlay for guest first |
| VRF seam | Merger | BGP between AS, one-way leaks |
| Per-building L3 | Campus L2 shrink | One building per window |
| Blue/green edge | Firewall/proxy replace | Steer by DNS/PBR gradually |

## Real-world — data center fabric swap

**Constraint:** No multi-hour stop-ship; 24×7 logistics app.

**Plan:**

1. Build new leaf-spine underlay beside old; dual-home edges where possible.
2. Move non-prod VNIs; prove EVPN scale and MTU.
3. Move one prod VRF; success = error budget + app synthetic.
4. Shift remaining; keep old default route withdrawable.
5. Decommission only after N days clean.

**Rejected:** Weekend “cut all VLANs to new” — no reversible midpoint.

## Real-world — 802.1X / SD-WAN that skipped dual-run

**Symptom:** Enforce or overlay flip without monitor/canary → clinical / POS outage → political rollback that poisoned the program.

**Fix:** Dual-run and phased enforce are part of the **design**, not a project-manager nicety.

## Step template (put in HLD appendix)

For each step write:

1. **Scope** — devices, sites, prefixes
2. **Prep** — configs staged, backups, OOB
3. **Execute** — command/pipeline wave
4. **Verify** — commands + synthetics + business check
5. **Abort** — exact rollback and time limit
6. **Comm** — who is notified; freeze neighbors

```text
Step 3: Building C to L3 distribution
  Verify: no Building C VLAN on core trunks; ping / probe green
  Abort: re-allow VLAN list; restore FHRP; < 30 min
  Success: storm test in closet does not raise Building A counters
```

## People and calendar

- Freeze windows vs Agile app trains—call the conflict early.
- Training: NOC must run the rollback without the designer on a plane.
- Vendors and circuits: long-lead items on the critical path.

## Risks

- “Migration TBD” on an otherwise pretty HLD.
- Success = “config applied” instead of service metrics.
- Parallel forever (technical debt dual-stack of everything).
- Rollback never practiced.

## Interview framing

“Every HLD I produce has a migration that is sliced, reversible, and has a numeric success test. Dual-run is the default; big-bang only when physics forces it.”

## Related

- [Extract requirements](03_Extract_Requirements.md)
- [Compare and justify](04_Compare_and_Justify.md)
- [Practical time and traps](05_Practical_Time_and_Traps.md)
- [CI/CD for the network](../17_Automation_and_Observability/03_CI_CD_for_Network.md)
- [NAC and zero trust](../16_Security_Design/03_NAC_and_Zero_Trust.md)

---
