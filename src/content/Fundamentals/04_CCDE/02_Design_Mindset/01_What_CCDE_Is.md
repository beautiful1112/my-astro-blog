# What CCDE is

CCDE (Cisco Certified Design Expert) certifies **expert-level network design**: gather and clarify functional requirements, produce a design that meets them, plan implementation/migration, and **convey decisions and rationale**.

It is not “CCIE with prettier visio.” It is a different professional act: choosing structure under incomplete information.

## What the designer owns

| Designer owns | Designer does not own (alone) |
|---|---|
| Boundaries, modules, and failure domains | Every platform CLI knob |
| Protocol *roles* in the architecture | Winning a break/fix race |
| Mapping business → technical | Guaranteeing a vendor SKU forever |
| Migration and operational fit | Implementing every leaf identically |
| Explicit discarded options | “The network just works” without constraints |

Cisco’s current program (v3.1) tests this across five unified domains: business strategy; control/data/management/ops; network design; service design; security design. Written emphasizes HLD and business in enterprise context. Practical adds a long scenario plus one elective.

## Mental model

```text
Stakeholders
  -> requirements / constraints / assumptions
  -> options (at least two)
  -> trade-off (scale, risk, cost, ops, time)
  -> chosen design + discarded reasons
  -> migration + measurement
```

A design without a discarded alternative is usually a preference, not a design.

## Interactions

| Mechanism | Interaction |
|---|---|
| CCIE-level protocol knowledge | Predicts whether a choice is operable |
| Project method (Agile/Waterfall) | Changes batch size and rollback story |
| Security / compliance | Hard constraints, not “phase 2” |
| Automation | Encodes the design; cannot invent missing architecture |

## Risks

- Treating CCDE as a protocol trivia contest → wrong study, wrong answers.
- Treating CCDE as pure business-speak → designs that cannot converge or be secured.
- Copying a reference architecture without the local R/C/A.

## Interview framing

“CCDE is expert design: I turn messy business and operational constraints into a modular network I can defend, migrate, and operate—not a pile of favorite features.”

---
