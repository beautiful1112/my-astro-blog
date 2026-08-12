# CCDE versus CCIE

Both are expert Cisco certifications. They optimize for **different jobs**.

## One-line split

- **CCIE:** can you make this network **work and stay working**—protocols, platforms, troubleshooting, implementation detail.
- **CCDE:** can you make this network **the right shape**—requirements, constraints, trade-offs, migration, and justification.

A strong CCIE is not automatically a CCDE. A CCDE who cannot reason about protocol behavior will propose designs that cannot be operated.

## What each rewards

| | CCIE-style | CCDE-style |
|---|---|---|
| Question | How do I configure / fix this? | Should this exist, and in which form? |
| Depth | Platform and protocol internals | Interaction of business + topology + ops |
| Success | It converges and forwards | Stakeholders can live with the blast radius and cost |
| Artifact | Working config, show output | Defensible HLD/LLD and migration |
| Failure | Wrong knob, missed state | Right knob in the wrong architecture |

## Complementary, not ranked

```text
Business outcome
    -> CCDE: architecture, planes, failure domains, policy points
         -> CCIE: implement, verify, restore
```

In a real team: the designer owns **why this topology and these boundaries**; the implementer owns **correct state and recovery**. The best designers still know enough protocol to predict operational pain.

## Study implication

Do **not** prepare CCDE by grinding more CCIE labs. Reuse protocol libraries (BGP, EIGRP, multicast) as **input to design questions**. If you cannot explain query scope, RR clusters, or RPF, you cannot design them—but explaining them is the start, not the exam.

## Interview framing

“CCIE proves I can operate the machine. CCDE proves I can choose the machine—and throw it away when the business constraint says so.”

---
