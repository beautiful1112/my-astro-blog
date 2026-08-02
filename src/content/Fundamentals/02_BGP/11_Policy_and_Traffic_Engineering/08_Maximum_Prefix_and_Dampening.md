# Maximum-Prefix and Route-Flap Dampening

**Maximum-prefix** limits protect memory, CPU, and policy boundaries when a neighbor sends more routes than expected. Choose warning and shutdown thresholds from the contracted table plus growth headroom, and define restart behavior.

**Route-flap dampening** penalizes repeatedly changing routes and temporarily suppresses unstable ones. Poor settings can delay recovery after a legitimate event and amplify harm, so it is not a universal Internet-edge default.

These solve different problems:

- Maximum-prefix constrains volume per peer.
- Dampening constrains repeated update behavior per prefix.

Monitor both route count and update rate. A peer can remain below the maximum while generating damaging churn.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
