# Case: MED Does Not Influence Two Upstreams

## Symptom

Two paths have MED 10 and 100, but the MED 100 path remains best.

## Reasoning

The routes came from different neighboring ASes. Default behavior compares MED only within the same neighboring AS.

## Proof

Neighbor ASNs differ, and the selected path won on a later criterion after MED comparison was skipped.

## Correction

Use LOCAL_PREF for local exit policy. Enable always-compare-med only after evaluating global impact and deterministic behavior.

## Lesson

MED is mainly a hint between adjacent ASes with multiple interconnects, not a universal metric.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
