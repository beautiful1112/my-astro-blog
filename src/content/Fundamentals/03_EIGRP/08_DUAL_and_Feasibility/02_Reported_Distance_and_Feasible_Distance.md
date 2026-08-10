# Reported distance and feasible distance

Two distances drive every DUAL decision. Confusing them is the most common EIGRP interview failure.

## Definitions

| Term | Who computes it | Meaning |
|---|---|---|
| **Reported Distance (RD)** | Neighbor | That neighbor’s **metric to the destination** as advertised to you (its best known distance, reported in the update/query/reply) |
| **Feasible Distance (FD)** | Local router | The **metric of the best path currently used** for that destination—i.e. the successor’s composite metric as recorded for feasibility checks |

Operationally:

- **RD** is “how far does my neighbor think it is from Dest?”
- **FD** is “what is *my* installed/recorded best metric for Dest while Passive?”

When you look at `show ip eigrp topology`, each path entry shows something like:

```text
P 10.1.1.0/24, 1 successors, FD is 30720
        via 192.0.2.1 (30720/28160), GigabitEthernet0/0
```

Here:

- Outer value `30720` = **local computed metric** through that neighbor (cost to neighbor + neighbor’s RD).
- Inner value `28160` = **RD** (neighbor’s metric to the destination).
- `FD is 30720` = feasible distance for FC checks—equal to the successor’s local metric in the steady Passive state.

## Historical vs current wording

Older texts say FD is the “lowest known metric since last Passive.” In practice for FC:

- While **Passive**, FD tracks the **successor metric** (best path in use).
- When a better path appears, FD updates to that better metric.
- When the successor worsens or is lost, DUAL uses the **recorded FD** against neighbors’ RDs to decide FS eligibility / whether to go Active.

Do not invent a separate “historical min forever” number distinct from the topology table’s FD field—use what the router prints as `FD is …`.

## Composite metric reminder

Local metric through a neighbor ≈ function of (path bandwidth, delay, …) using K-values. RD is already the neighbor’s composite; you add the link cost from you to that neighbor to get your metric via that neighbor.

```text
Your metric via N = link_cost(you → N) ⊕ RD_N(dest)
FD                 = metric of current successor path
```

## Worked numbers

```text
Dest D
Neighbor A: RD=100, link cost to A=50  → metric via A = 150
Neighbor B: RD=140, link cost to B=20  → metric via B = 160
```

Successor = A (best local metric 150). **FD = 150**.  
B’s RD (140) is **not** &lt; FD (150)? Wait—140 &lt; 150 → B **passes FC** → B is a feasible successor even though its local metric (160) is worse than A.

## Verification

```text
show ip eigrp topology
show ip eigrp topology 10.1.1.0/24
show eigrp address-family ipv4 topology
```

Confirm for each candidate: inner metric = RD; FD line; which path is successor (`via …` listed first / “successors” count).

## Interview framing

“RD is the neighbor’s distance; FD is my successor’s metric used for the feasibility test. Inner number in topology output is RD; FD is printed explicitly.”

## Related

- [Feasibility condition](03_Feasibility_Condition.md)
- [Successor selection](04_Successor_Selection.md)
- [Metrics and K-values](../07_Metrics_and_K_Values/README.md)

---
