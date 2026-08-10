# DUAL Memory Card

| Term | One-line definition |
|---|---|
| **RD** | Neighbor’s advertised distance to the destination |
| **FD** | Best metric we have recorded for FC while Passive (feasibility baseline; successor metric while Passive) |
| **FC** | Neighbor is loop-free alternate if **RD < FD** |
| **Successor** | Best-path neighbor installed (subject to max-paths) |
| **FS** | Feasible successor—passes FC, not currently best |
| **Passive** | Stable; DUAL local computation sufficient |
| **Active** | No FS after successor loss → Query diffusion |
| **Reply** | Ends neighbor’s responsibility for that Query |
| **SIA** | Active too long / stuck waiting; design with stub+summary |

## Decision flash

1. Successor OK? → Passive.
2. Successor lost + FS? → **local repair**, stay Passive.
3. Successor lost + no FS? → **Active**, Query, wait Replies.
4. Replies done? → new successor, Passive.
5. Waiting forever? → SIA path (SIA-Query/Reply, neighbor reset risk)—fix the **query domain**.

## Interview sentence

“DUAL is loop-free distance-vector convergence: FC for local repair, Queries when diffusion is required—not OSPF flooding.”

---
