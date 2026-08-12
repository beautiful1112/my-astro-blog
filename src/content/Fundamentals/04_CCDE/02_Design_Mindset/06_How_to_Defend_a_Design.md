# How to defend a design

A CCDE answer is a **defense**, not a catalog. Defense means: this option meets the requirements, respects constraints, names risks, and beats a plausible alternative.

## Defense template (60 seconds)

1. **Outcome:** “Branches must survive hub loss within 60 s and keep PCI isolated.”
2. **Choice:** “Dual-homed SD-WAN with local DIA and a PCI VRF to a regional firewall.”
3. **Why not the alternative:** “Full-mesh DMVPN on a single hub violates the hub-loss requirement; stretching PCI L2 to the hub expands the compliance domain.”
4. **Risk you accept:** “Internet quality varies; we buy SLA probes and a small private backup for voice.”
5. **How we will know:** “App-route success rate, firewall policy hit, RTO drill.”

## What examiners/stakeholders attack

| Attack | Weak reply | Strong reply |
|---|---|---|
| “Why not simpler?” | “Best practice” | Constraint + blast radius |
| “What if X fails?” | “It is redundant” | Fate-share analysis |
| “Can ops run this?” | “We will train” | Skill/tooling already in constraints, or phased |
| “What about migration?” | “Cut over this weekend” | Parallel, rollback, success criteria |

## Discard explicitly

Write the discarded option. Silence looks like you only know one trick. On Practical, a later requirement may resurrect the discarded option—you want it already analyzed.

```text
Keep:     modular L3, summary at region
Discard:  single OSPF area for "simplicity"
Reason:   LSDB/SPF and blast radius fail the scale constraint
```

## Interview framing

“I defend a design by stating the outcome, the choice, the rejected alternative, the risk I am taking, and the signal that would make me change my mind.”

---
