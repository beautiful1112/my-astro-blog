# Redistribution as a design smell

Redistribution is a **seam**, not a topology. Mutual redistribution without tags and filters is how you buy loops, suboptimal paths, and troubleshooting debt that outlives every engineer who “temporary”’d it.

## When it is justified

- Migration (OSPF → IS-IS) for a **defined** period with an exit date
- Merger of two ASes/IGPs with a date to collapse
- PE-CE where the CE IGP is a customer constraint
- Injecting a **limited** set of statics/connected into an IGP
- One-way leak of a default or a handful of aggregates

## When it is a smell

- Two IGPs forever because “that is how it grew”
- Redistributing BGP into IGP (prefix explosion, instability)
- Mutual redistribute at two routers with no tags → loops
- Redistributing everywhere “so everything knows everything”

```text
Prefer:
  OSPF domain --(tag/filter)--> BGP --(tag/filter)--> IS-IS
                   single policy story at the seam

Avoid:
  OSPF <==mutual==> EIGRP <==mutual==> OSPF
         (two borders, no tags, administrative distance fights)
```

## Mechanics that matter in design (not just CLI)

| Control | Purpose |
|---|---|
| Route tags | Mark origin so you never re-inject foreign routes |
| Prefix filters | Bound what crosses the seam |
| AD / preference | Make one border primary; avoid hot-potato surprises |
| One-way vs mutual | Mutual needs a loop-prevention story |
| Aggregation | Prefer aggregates over thousands of specifics |

Administrative distance alone is not a design. Tags + filters + a **primary/backup border** story are.

## Real-world — bank merger, 18-month dual IGP

**Facts:** Bank A runs OSPF; Bank B runs EIGRP; overlapping `10.0.0.0/8`; legal day-1 in 90 days; full renumber in 18 months.

| R / C / A | Statement |
|---|---|
| R | Named apps reachable across companies from day 1 |
| R | No routing loop under single border failure |
| C | Cannot collapse to one IGP before renumber |
| A | “NAT everywhere is enough” — still need routing policy for non-NAT flows |

```text
Bank A OSPF ---- ASBR/FW/BGP seam ---- Bank B EIGRP
                    |     |
                 tags   filters
                 dual borders, primary/secondary
```

**Design:** BGP (or firewall) as the glue; **do not** mutual-redistribute OSPF↔EIGRP on two pairs without tags. Prefer BGP between domains; inject only defaults/aggregates into each IGP. Exit criterion: one underlay IGP after renumber—written on the program plan.

## Real-world — manufacturing plant adds cloud VRF

**Smell in progress:** Plant IT redistributes cloud VPN BGP into plant OSPF so “shop floor can ping cloud.”

**What breaks:** Cloud prefix churn and withdrawals hit every plant ABR; OT sees SPF noise; one mis-advertised more-specific blackholes a cell.

| Option | Verdict |
|---|---|
| Redistribute full BGP → OSPF | Reject |
| Default + few aggregates into OSPF; keep BGP at border | Accept |
| Separate VRF for IT cloud; OT stays local | Prefer |

## Prefer BGP as glue

IGP should stay an underlay, not a dumping ground. Between administrative domains, **BGP carries policy**; IGPs carry local reachability. Redistribution then becomes “inject what the IGP is allowed to know,” not “merge two databases.”

## Design checklist

1. Why does a second protocol exist—migration, merger, PE-CE, or accident?
2. What is the exit date or permanent seam architecture?
3. Are tags/filters/AD documented as a single policy story?
4. How many prefixes cross the seam on a bad day?
5. What loop forms if both borders are mutual and a filter is forgotten?

## Risks

- Mutual redistribution without tags at multiple borders.
- BGP Internet or cloud tables leaking into OSPF/IS-IS.
- “Temporary” seams that become tribal knowledge.
- Suboptimal traffic from competing distances and ignored metrics on redistributed routes.

## Interview framing

“Redistribution is a temporary or narrow seam with tags and a single policy story. If I need two IGPs forever, I should ask whether BGP should sit between them.”

## Related

- [Choosing an IGP](01_Choosing_an_IGP.md)
- [Hierarchy and summarization](02_Hierarchy_and_Summarization.md)
- [ABR and ASBR placement](../07_OSPF_Design/02_ABR_and_ASBR_Placement.md)
- [OSPF to IS-IS migration](../08_ISIS_Design/04_OSPF_to_ISIS_Migration.md)

---
