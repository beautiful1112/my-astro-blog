# Extract requirements

Build the R/C/A table **as you read**, not after you pick OSPF.

| ID | Quote / paraphrase | Type | Design impact |
|---|---|---|---|
| R1 | DC-B must serve if DC-A dies in 15 min | Req | Dual DC, DNS, no L2 stretch |
| C1 | Keep existing OSPF this year | Constr | Overlay or BGP seam |
| A1 | Internet jitter < 30 ms | Assum | Validate or buy MPLS for voice |

When the scenario updates, **strike or add rows**. Answers that ignore a new constraint are the usual failure.

Ask (or flag) missing RTO rather than inventing five-nines.

## Interview framing

“I number requirements and I update the table when the story changes. The table drives the option, not the other way around.”

---
