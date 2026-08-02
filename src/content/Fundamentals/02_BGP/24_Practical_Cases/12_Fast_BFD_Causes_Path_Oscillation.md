# Case: Aggressive BFD Causes Path Oscillation

## Symptom

A congested interconnect repeatedly drops and restores its BGP session, moving latency-sensitive traffic between paths.

## Reasoning

BFD timers are tighter than the platform and congested control path can reliably sustain.

## Proof

BFD expires without physical loss; control-plane queue drops and CPU spikes align with session resets.

## Correction

Protect/control-prioritize BFD traffic, tune timers to tested limits, and add policy hysteresis. Verify real link-failure loss after tuning.

## Lesson

Fast detection that creates false failures reduces availability.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
