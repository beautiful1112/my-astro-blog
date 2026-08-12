# Fate sharing

Fate sharing is **hidden common mode**: same conduit, same ToR, same controller cluster, same L2, same identity, same change window.

```text
"Redundant" CE routers
    both uplinks in one 24-fiber
    both powered from one PDU
    both config-pushed in one Ansible play
```

CCDE answers that add a second logo without asking “what do they still share?” are weak.

Mitigations: diverse entrance, diverse power, staged automation, split controllers, L3 between DCs.

## Interview framing

“I hunt shared fate—power, fiber, control, identity, change—before I believe a redundancy diagram.”

---
